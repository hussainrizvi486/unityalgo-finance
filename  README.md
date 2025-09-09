project-root/
│
├── apps/
│   ├── backend/                   # Django backend
│   │   ├── manage.py
│   │   ├── pyproject.toml         # poetry/pip-tools
│   │   ├── requirements/          # split requirements
│   │   │   ├── base.txt
│   │   │   ├── dev.txt
│   │   │   ├── prod.txt
│   │   ├── config/                # Django settings (12-factor)
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── dev.py
│   │   │   ├── prod.py
│   │   ├── core/                  # shared utils (mixins, validators, decorators)
│   │   ├── users/                 # authentication & accounts
│   │   ├── billing/               # payments module
│   │   ├── api/                   # DRF/GraphQL endpoints
│   │   │   ├── v1/
│   │   │   │   ├── serializers.py
│   │   │   │   ├── views.py
│   │   │   │   ├── urls.py
│   │   │   │   └── schema.py      # GraphQL schemas (if used)
│   │   ├── domain_x/              # feature domain (DDD style)
│   │   ├── templates/             # emails, Django admin
│   │   ├── static/                # admin static assets
│   │   └── media/                 # uploaded files (local dev only)
│   │
│   └── frontend/                  # React frontend (Vite or Next.js)
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── public/                # static assets
│       └── src/
│           ├── app/               # app shell (routing, layouts, providers)
│           ├── features/          # feature slices (per domain)
│           │   ├── auth/
│           │   │   ├── api.ts
│           │   │   ├── hooks.ts
│           │   │   ├── components/
│           │   │   └── pages/
│           │   └── dashboard/
│           ├── entities/          # reusable models/entities (user, product, order)
│           ├── shared/            # ui components, hooks, utils
│           ├── widgets/           # feature-composed components (dashboards, menus)
│           └── index.tsx
│
├── packages/                      # shared libraries (optional)
│   ├── api-contracts/             # OpenAPI/GraphQL schemas & TS types
│   ├── utils/                     # language-agnostic helpers
│
├── infra/                         # infrastructure as code
│   ├── docker/                    # Dockerfiles, docker-compose
│   ├── k8s/                       # Helm charts / K8s manifests
│   └── terraform/                 # Cloud infra provisioning
│
├── ops/                           # operational scripts, CI helpers
│   ├── scripts/
│   ├── migrations/                # DB/data migrations (non-Django)
│
├── .github/workflows/             # GitHub Actions CI/CD pipelines
├── .gitignore
├── README.md
└── Makefile                       # common dev commands
