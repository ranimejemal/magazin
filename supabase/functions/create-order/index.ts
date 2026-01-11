import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface OrderRequest {
  items: CartItem[];
  shippingInfo: ShippingInfo;
  deliveryOption: 'standard' | 'express';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const body: OrderRequest = await req.json();
    
    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart items are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.shippingInfo) {
      return new Response(
        JSON.stringify({ error: 'Shipping information is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate shipping info fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip'];
    for (const field of requiredFields) {
      if (!body.shippingInfo[field as keyof ShippingInfo]?.trim()) {
        return new Response(
          JSON.stringify({ error: `${field} is required` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.shippingInfo.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch product prices from database (SERVER-SIDE VALIDATION)
    const productIds = body.items.map(item => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image, in_stock, stock_count, is_active')
      .in('id', productIds);

    if (productsError || !products) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch product details' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate all products exist, are active, and in stock
    const productMap = new Map(products.map(p => [p.id, p]));
    const orderItems: Array<{
      product_id: string;
      product_name: string;
      product_image: string | null;
      quantity: number;
      price: number;
    }> = [];
    let subtotal = 0;

    for (const item of body.items) {
      const product = productMap.get(item.productId);
      
      if (!product) {
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.productId}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!product.is_active) {
        return new Response(
          JSON.stringify({ error: `Product is no longer available: ${product.name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!product.in_stock || (product.stock_count !== null && product.stock_count < item.quantity)) {
        return new Response(
          JSON.stringify({ error: `Insufficient stock for: ${product.name}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate quantity
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
        return new Response(
          JSON.stringify({ error: 'Invalid quantity' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        quantity: item.quantity,
        price: itemTotal,
      });
    }

    // Calculate fees server-side (don't trust client)
    const deliveryFee = body.deliveryOption === 'express' ? 9.99 : (subtotal >= 50 ? 0 : 4.99);
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    // Create or find shipping address
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', user.id)
      .eq('street', body.shippingInfo.address)
      .eq('city', body.shippingInfo.city)
      .eq('state', body.shippingInfo.state)
      .eq('postal_code', body.shippingInfo.zip)
      .maybeSingle();

    let addressId = existingAddress?.id;

    if (!addressId) {
      const { data: newAddress, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          street: body.shippingInfo.address,
          city: body.shippingInfo.city,
          state: body.shippingInfo.state,
          postal_code: body.shippingInfo.zip,
          country: 'US',
        })
        .select('id')
        .single();

      if (addressError) {
        return new Response(
          JSON.stringify({ error: 'Failed to save shipping address' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      addressId = newAddress.id;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        subtotal,
        delivery_fee: deliveryFee,
        tax,
        total,
        shipping_address_id: addressId,
        status: 'pending',
        delivery_status: 'pending',
        estimated_delivery: new Date(Date.now() + (body.deliveryOption === 'express' ? 2 : 5) * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select('id')
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      // Try to clean up the order if items failed
      await supabase.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update product stock counts
    for (const item of body.items) {
      const product = productMap.get(item.productId);
      if (product && product.stock_count !== null) {
        await supabase
          .from('products')
          .update({ 
            stock_count: product.stock_count - item.quantity,
            in_stock: (product.stock_count - item.quantity) > 0,
          })
          .eq('id', item.productId);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        total: total.toFixed(2),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Log error server-side only, return generic message to client
    console.error('Order creation error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
