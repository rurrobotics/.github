# .github

Organization-wide files for [RUR Robotics](https://github.com/rurrobotics). GitHub shows [`profile/README.md`](profile/README.md) on the [organization page](https://github.com/rurrobotics).

## Layout

| Path                                 | What it does                                               |
| ------------------------------------ | ---------------------------------------------------------- |
| `profile/README.md`                  | The organization page                                      |
| `scripts/sync-projects.mjs`          | Rebuilds the projects table from the website's data        |
| `.github/workflows/sync-projects.yml` | Runs the script and commits the result                     |

## Projects table

The projects table in `profile/README.md` is generated, so don't edit it by hand. The source of truth is [`src/content/projects.toml`](https://github.com/rurrobotics/rurrobotics.github.io/blob/stable/src/content/projects.toml) in the website repo. Anything between `<!-- projects:start -->` and `<!-- projects:end -->` gets overwritten.

How it syncs:

1. A push to `stable` in `rurrobotics.github.io` that changes `projects.toml` runs that repo's `notify-org-profile.yml`.
2. That workflow sends a `projects-updated` `repository_dispatch` event to this repo.
3. `sync-projects.yml` downloads `projects.toml`, regenerates the table (English descriptions, sorted by `order`) and commits the change if there is one.

You can also run the sync by hand from the Actions tab (**Sync projects from website → Run workflow**).

### Token

The website repo needs the `ORG_PROFILE_TOKEN` secret to send the event: a fine-grained personal access token or GitHub App token with **Contents: read & write** on `rurrobotics/.github`. When it expires, replace it with:

```sh
gh secret set ORG_PROFILE_TOKEN --repo rurrobotics/rurrobotics.github.io
```

### Running locally

```sh
npm install --no-save smol-toml@1
node scripts/sync-projects.mjs
```

Tag names are shown capitalized. To change how a tag is spelled (for example `opencv` as OpenCV), add it to `known` in the script.
