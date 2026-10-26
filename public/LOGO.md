# Logo assets — read before adding an image

## The only approved inline logo

`Resource_Realty_Logo_correct_email.jpeg` (21 KB) — copied into this repo from
`~/dev/resource-realty/realtycomps/public/` so artifacts are self-contained
(no cross-repo links). Use it for every `<img>`:

```html
<img src="/Resource_Realty_Logo_correct_email.jpeg" alt="Resource Realty"
     style="height: 40px; width: auto; object-fit: contain;" />
```

## NEVER use

- **`Resource_Realty_Logo.jpg`** — the wordmark is misspelled **"REALITY"**.
  It is a deprecated rollback asset and *still returns HTTP 200* at the
  resource-realty.org origin. **A 200 is not permission.** Do not copy it into
  this repo, do not hotlink it, do not "fix" it in place.
- `Resource_Realty_Logo_correct.jpeg` (1.6 MB) — master art, print/large only.
  Never inline.

## Rule of thumb

If a file name does not contain `correct_email`, it does not belong in an
artifact on `cma.resource-realty.org`.
