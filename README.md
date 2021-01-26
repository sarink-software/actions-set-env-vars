# actions-set-env-vars

Action to dynamically set the `.env` file and output common env vars

## Ouputs

```
APP_ENV
# Set to dev, qa, stage, or prod (based on branch name)
```

```
NODE_VERSION
# Set to the value found in the `.nvmrc` file
```

```
All values inside .env file
# Set as key value pairs on the "outputs" of this action
```

## Usage

```
jobs:
  your_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Set env vars
        id: set-env-vars
        uses: sarink-software/actions-set-env-vars@main

      - name: Setup node
        uses: actions/setup-node@v1
        with:
          node-version: ${{ steps.set-env-vars.outputs.NODE_VERSION }}

      - name: Read .env file
        run: cat .env
```
