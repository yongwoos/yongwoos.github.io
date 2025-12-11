# Copilot Instructions for yongwoos.github.io

## Project Overview

This is a **Hugo-based static documentation site** (박용우의 docs) built with the Hextra theme. It serves as a personal knowledge base covering cloud computing, DevOps, Kubernetes, 5G, and various software engineering topics.

- **Framework**: Hugo (static site generator)
- **Theme**: Hextra (GitHub: imfing/hextra)
- **Deployment**: Netlify + GitHub Pages (`yongwoos.github.io`)
- **Language**: Markdown for content, YAML for configuration

## Essential Architecture & Patterns

### Content Structure
- **Location**: `/content/` directory organized by topic (5g/, aws/, k8s/, etc.)
- **Organization**: Each topic folder has an `_index.md` (landing page) + individual markdown files
- **File Format**: Markdown with YAML frontmatter containing `title` and `weight` (controls nav order)
- **Example**: 
  - `/content/aws/_index.md` - AWS topic landing page
  - `/content/aws/ec2.md` - Specific AWS topic
  - `/content/5g/beamforming.md` - 5G topic

### Build & Local Development

**Build command** (Netlify):
```bash
hugo --gc --minify -b ${DEPLOY_PRIME_URL}
```

**Hugo version**: 0.148.2 (defined in netlify.toml)

**Local server with drafts**:
```bash
hugo server --buildDrafts --disableFastRender
```

**Key Hugo features in use**:
- Inline shortcodes enabled (`enableInlineShortcodes: true`)
- Markdown passthrough for KaTeX math: use `%%...%%` for inline, `$$...$$` for blocks
- Hextra theme imported as a Go module in `hugo.yaml`

### Theme Configuration (Hextra)

Located in `params` section of `hugo.yaml`:
- **Search**: FlexSearch enabled (indexes by content, forward tokenization)
- **Theme**: Dark mode as default with toggle
- **Page width**: "wide" (90rem)
- **Analytics**: Google Analytics enabled (ID: G-M2KMRBDS6T)
- **Blog features**: 
  - List sorting by date (descending)
  - Tag display enabled
  - Display updated date enabled

### Adding New Content

1. Create markdown file in appropriate `/content/topic/` folder
2. Add YAML frontmatter:
   ```yaml
   ---
   title: Your Page Title
   ---
   ```
3. Use KaTeX math: `%%\LaTeX equations%%` for inline or `$$block$$` for block format
4. Can include raw HTML (unsafe rendering enabled in markup config)

## Critical Workflow Commands

| Task | Command |
|------|---------|
| **Local preview** | `hugo server --buildDrafts --disableFastRender` |
| **Production build** | `hugo --gc --minify` |
| **Build with base URL** | `hugo --gc --minify -b <URL>` |
| **Module update** | `hugo mod tidy` (if theme updates needed) |

## Key Configuration Files

- **`hugo.yaml`**: Main configuration - theme module imports, search settings, analytics, math rendering
- **`netlify.toml`**: Build environment - Hugo version pinning, publish directory, build command
- **`go.mod`**: Module dependencies - Hextra theme as Go module
- **`CNAME`**: GitHub Pages custom domain configuration

## Deployment Context

- **Primary**: Netlify (uses netlify.toml for builds)
- **Alternative**: GitHub Pages (repository name: yongwoos.github.io)
- **Custom domain**: Set via CNAME file
- **Auto-deploy**: Triggered by pushes to `main` branch

## Development Environment

- **Dev container**: `.devcontainer/` configured (check for Docker/Codespaces setup)
- **Gitpod support**: `.gitpod.yml` exists
- **Git config**: Standard with Hextra starter template baseline

## Important Conventions

1. **Weight-based navigation**: Lower `weight` values appear first in sidebars/menus
2. **Topic isolation**: Each topic folder is self-contained with its own `_index.md`
3. **Math rendering**: Uses KaTeX via Goldmark passthrough - inline: `%%...%%`, block: `$$...$$`
4. **No edit URLs**: `editURL.enable: false` - not configured for direct GitHub editing from site
5. **Content indexing**: Blog list sorting is date-based (descending), not alphabetical

## Common Patterns in Codebase

- Multiple topic areas as independent documentation sections (AWS, K8s, CI/CD, etc.)
- Heavy use of project case studies and technical notes (mobilityschool/, ae_project/, softbank_hackerton/)
- Mix of Korean and English content
- Code examples embedded directly in markdown
- Infrastructure-as-code documentation patterns (Jenkins pipelines, Docker, Kubernetes configs)
