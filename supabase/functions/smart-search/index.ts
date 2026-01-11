import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, products } = await req.json();

    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ suggestions: [], enhancedQuery: query }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('AI API key not configured');
    }

    const productList = products?.slice(0, 20).map((p: any) => p.name).join(', ') || '';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a helpful grocery search assistant. Given a user's search query, provide:
1. Up to 5 relevant search suggestions that a grocery shopper might want
2. An enhanced/corrected version of their query (fix typos, expand abbreviations)

Available products context: ${productList}

Respond in JSON format:
{
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "enhancedQuery": "corrected/enhanced query",
  "relatedCategories": ["category1", "category2"]
}`
          },
          {
            role: 'user',
            content: `Search query: "${query}"`
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    // Parse JSON from response
    let result;
    try {
      // Handle markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      result = JSON.parse(jsonMatch[1] || content);
    } catch {
      result = { suggestions: [], enhancedQuery: query, relatedCategories: [] };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Smart search error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ suggestions: [], enhancedQuery: '', error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
