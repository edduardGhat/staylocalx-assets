# N8N Workflow — Staylocalx Multi Publisher

## Flow actual + extensión single image

```
[Telegram Trigger]
    ↓
[IF: starts with /publish_]
    ↓ TRUE
[HTTP Request: fetch registry.json]
    ↓
[Code Job Builder] ← cada job tiene ahora un campo `format`
    ↓
[Split Out: jobs]
    ↓
[IF: format === "carousel"]
    ↓ TRUE                              ↓ FALSE
[Split Out1: images]                [HTTP Request: create single container]
    ↓                                   ↓
[HTTP Request: create item]         [Wait 5s]
    ↓                                   ↓
[Code: aggregate by ig_id]          [HTTP Request: publish single]
    ↓
[HTTP Request1: create carousel]
    ↓
[Wait 10s]
    ↓
[HTTP Request2: publish carousel]
```

## Endpoints Meta

### Single image
```
POST https://graph.facebook.com/v22.0/{ig_id}/media
  ?image_url={image_url}
  &caption={caption}
  &access_token={token}

→ devuelve { id: "container_id" }

POST https://graph.facebook.com/v22.0/{ig_id}/media_publish
  ?creation_id={container_id}
  &access_token={token}

→ devuelve { id: "post_id" }
```

### Carousel (lo que ya tenemos)
```
1. Crear item por cada imagen (is_carousel_item=true)
2. Crear container CAROUSEL con children=[ids]
3. Publish
```

## Auto-detección

El Code Job Builder asigna `format`:
- `images.length === 1` → `format: "single"`
- `images.length >= 2` → `format: "carousel"`
- Override manual: `target.format` o `content.format` en registry.json
