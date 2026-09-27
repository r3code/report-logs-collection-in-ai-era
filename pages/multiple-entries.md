# Multiple Entries

You can split your slides.md into multiple files and organize them as you want using the `src` attribute.

#### `slides.md`

```markdown
# Page 1

Page 2 from main entry.

---
src: ./pages/multiple-entries.md
---
```

#### `pages/multiple-entries.md`

```markdown
# Page 2

This page is from a separate file.
```
