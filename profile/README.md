Core subdomains (your list)
These map cleanly to roles in your ecosystem:
1.	 os.shivanshsethi.in  – ShivanshOS portal / landing / dashboard
2.	 login.shivanshsethi.in  – Central SSO / identity portal (Keycloak/Authelia/Cloudflare Access)
3.	 dev.shivanshsethi.in  – Developer portal, internal docs, sandboxes, maybe dev instances of apps
4.	 git.shivanshsethi.in  – GitHub Enterprise Server (or Gitea/Forgejo) root
5.	 docs.shivanshsethi.in  – Public/internal documentation (MkDocs, Docusaurus, GitBook mirror, etc.)
6.	 avatars.shivanshsethi.in  – Static asset host for profile images, org logos, etc. (S3/MinIO/Cloudflare R2 + CDN)
7.	 id.shivanshsethi.in  – Identity provider / OIDC/SAML endpoint (could be same backend as  login , different hostname for protocol clarity)
Recommended additional subdomains
Grouped by function; you don’t need all at once, but this gives you a scalable blueprint.
Identity & access
•	 auth.shivanshsethi.in  – Alternative or alias for  login / id  if you run Keycloak/Authelia; useful for OIDC redirect URIs.
•	 sso.shivanshsethi.in  – Human-friendly alias for corporate SSO landing (can CNAME to  login  or  id ).
•	 admin.shivanshsethi.in  – Admin consoles (Cloudflare Zero Trust, Keycloak admin, Grafana, etc.) behind stricter policies.
Git & code
For GitHub Enterprise Server (GHES), GitHub recommends subdomain isolation for security and features (Actions, Pages, registries, etc.). At minimum:
•	 git.shivanshsethi.in  – Main web UI and API (you already have this).
•	 *.git.shivanshsethi.in  – Wildcard for GHES subdomain isolation (avatars, hooks, actions, etc.).[github]
•	 registry.shivanshsethi.in  or  packages.shivanshsethi.in  – Container/npm/maven package registry front (can be under GHES or separate).
•	 src.shivanshsethi.in  – Optional alias for code browsing if you want a cleaner URL than  git .
Docs & knowledge
•	 docs.shivanshsethi.in  – Main docs (you have this).
•	 kb.shivanshsethi.in  or  wiki.shivanshsethi.in  – Internal knowledge base / Obsidian publish / GitBook / Docusaurus “wiki” instance.
•	 api.shivanshsethi.in  – API docs (OpenAPI/Swagger UI) for your agents and services.
•	 status.shivanshsethi.in  – Uptime/status page (Uptime Kuma, Grafana, or custom).
Apps & agents
•	 app.shivanshsethi.in  – Generic app gateway; you can route different paths/services behind this via reverse proxy or Cloudflare Tunnel routes.
•	 agent.shivanshsethi.in  or  agents.shivanshsethi.in  – Agent orchestration UI (LangGraph, custom MCP dashboards, etc.).
•	 lab.shivanshsethi.in  – Experimental projects, demos, HPC job dashboards.
•	 hpc.shivanshsethi.in  – HPC portal (JupyterHub, Slurm web UI, Grafana, etc.).
Assets & media
•	 avatars.shivanshsethi.in  – As planned.
•	 static.shivanshsethi.in  – General static assets (JS, CSS, images) for ShivanshOS and other apps.
•	 cdn.shivanshsethi.in  – Optional dedicated CDN hostname if you want explicit cache policies.
•	 media.shivanshsethi.in  – Larger media (videos, recordings, drone footage, etc.).
Infrastructure & ops
•	 dash.shivanshsethi.in  – Operations dashboard (Grafana, Prometheus, Loki, etc.).
•	 logs.shivanshsethi.in  – Log viewer (Grafana/Loki, Graylog, etc.).
•	 vault.shivanshsethi.in  – Secrets UI (HashiCorp Vault, if you expose it).
•	 ci.shivanshsethi.in  – CI/CD UI (GitHub Actions self-hosted runners dashboard, Argo CD, etc.).
Personal & showcase
Given your “showcase list” requirement:
•	 me.shivanshsethi.in  or  profile.shivanshsethi.in  – Personal landing page with links to:
•	Google Dev profile
•	AWS Builder profile
•	Substack / Medium / Blog
•	LinkedIn, FB, Instagram
•	GitHub profiles
•	Other dev platforms
•	 links.shivanshsethi.in  – Simple link-in-bio style page.
•	 blog.shivanshsethi.in  – If you want a dedicated blog separate from  docs .
DNS record design (Cloudflare)
Assuming:
•	You’re using Cloudflare DNS for  shivanshsethi.in .
•	Most services are exposed via Cloudflare Tunnel ( cloudflared ) and/or Cloudflare Zero Trust.
•	You may have some services on fixed IPs (e.g., GHES VM, HPC node).
1. Base domain and default
•	 shivanshsethi.in  (apex)
•	Type:  A  (or  AAAA ) → HPC/workstation public IP or
•	Use Cloudflare “root domain” with Tunnel (Cloudflare supports apex via Tunnel in some setups; otherwise use  www  as primary).
•	 www.shivanshsethi.in 
•	Type:  CNAME  →  os.shivanshsethi.in  (or directly to Tunnel hostname).
2. Core ShivanshOS subdomains
For each of these, you’ll typically create a Cloudflare Tunnel route and then a CNAME to the tunnel’s  <UUID>.cfargotunnel.com , or let Cloudflare auto-create the CNAME when you add a “Public Hostname” in the Tunnel UI.[cloudflare +2]
