# action-caprover

GitHub Action for Caprover. Provides additional features, other than the CLI provides, like create or destroy apps, and update registry password

## Inputs

### `host`: required

CapRover machine url i.e., https://captain.your-domain.com

### `password`: required

CapRover admin password. Use secret for more security

### `app`: required

App name on CapRover server

### `action` (default: "deploy")

Action to be performed. Possible values: deploy, create-app, delete-app, update-registry-password.

### `image`

Image to be deployed. It should either exist on server, or it has to be public, or on a private repository that CapRover has access to.

### `fail_if_exists`

If true, action will fail if app already exists, otherwise, it won't do anything

### `registry_password`

Registry password to be placed if you have a registry with an AWS user

## Usage

### deployment

```yml
uses: jhonatanmacazana/action-caprover@v0.1.0
with:
  host: "${{ secrets.CAPROVER_URL }}"
  password: "${{ secrets.CAPROVER_PASSWORD }}"
  app: "my-app"
  action: "deploy"
  image: "YOUR-DOCKER-IMAGE-NAME"
```

### create an app

This action will create 2 caprover apps. `my-app` without persistent storage, and `my-app-db` with persistent storage. You can throw an error if an app already exists by modyfing the fail_if_exists input

```yml
uses: jhonatanmacazana/action-caprover@v0.1.0
with:
  host: "${{ secrets.CAPROVER_URL }}"
  password: "${{ secrets.CAPROVER_PASSWORD }}"
  app: "my-app"
  action: "create-app"
```

```yml
uses: jhonatanmacazana/action-caprover@v0.1.0
with:
  host: "${{ secrets.CAPROVER_URL }}"
  password: "${{ secrets.CAPROVER_PASSWORD }}"
  app: "my-app"
  action: "create-app"
  fail_if_exists: "true"
```

### delete an app

This action will delete 1 caprover app. In this case, it would delete the `my-app` app

```yml
uses: jhonatanmacazana/action-caprover@v0.1.0
with:
  host: "${{ secrets.CAPROVER_URL }}"
  password: "${{ secrets.CAPROVER_PASSWORD }}"
  app: "my-app"
  action: "delete-app"
```

### update registry password

This action will update the registry password of a registry whose registryUser is AWS

```yml
uses: jhonatanmacazana/action-caprover@v0.1.0
with:
  host: "${{ secrets.CAPROVER_URL }}"
  password: "${{ secrets.CAPROVER_PASSWORD }}"
  app: "my-app"
  action: "update-registry-password"
  registry_password: "${{ secrets.AWS_ECR_PASS }}"
```
