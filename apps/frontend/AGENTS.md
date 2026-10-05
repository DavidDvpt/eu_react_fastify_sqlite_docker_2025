# Frontend container hierarchy

Use the following container hierarchy for page layouts:

```text
Panel > Section > SubSection
```

- `Panel` is a generic layout wrapper used to divide a page body. A `Panel` may contain another `Panel`.
- Every visual component rendered directly inside a `Panel` must be a `Section`.
- `GenericList` must be rendered as a `Section` component. Since `GenericList` owns its `Section` wrapper, do not wrap a `GenericList` in another `Section`.
- A `Section` must not contain another `Section` or a `Panel`.
- A `Section` may contain multiple `SubSection` components.
- `SubSection` is the leaf container and must not contain `Panel` or `Section` components.
- Overlay components rendered through a portal, such as modals, are exempt from the visual hierarchy when they do not render inside the panel DOM tree.

## Production Docker deployment

The production image is built locally on the target server. It is not pushed to
Docker Hub and the production Compose file does not pull an image.

Naming conventions follow the backend project:

- Compose source: `docker/prod/entropia-manager-frontend.yaml`
- Build script: `scripts/docker-build-frontend.sh`
- Server deployment script: `scripts/server/entropia-manager-frontend-deploy.sh`
- Server control scripts: `scripts/server/entropia-manager-frontend-start.sh` and
  `scripts/server/entropia-manager-frontend-stop.sh`

Run the deployment script from a frontend checkout on SER5:

```sh
IMAGE_TAG=2.0.0 ./scripts/server/entropia-manager-frontend-deploy.sh
```

The script builds `entropia-manager-frontend:${IMAGE_TAG:-latest}` and, when
the tag is versioned, also updates `entropia-manager-frontend:latest`. It then
installs the Compose file at `/opt/docker/entropia-manager-frontend.yaml`,
copies the control scripts to `$HOME/scripts`, and starts the frontend using
the stable `latest` tag. The host must already have Docker Buildx and the
external `ser5-network` Docker network.
