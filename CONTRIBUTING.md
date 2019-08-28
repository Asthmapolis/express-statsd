## DEVELOPMENT

### Branching model

This repository uses a simplified branching model:

| Branch      | Description                |
| ----------- | -------------------------- |
| `master`    | Stable, publish-able work  |
| `feature/*` | Unstable, work in progress |

### Publishing changes

1.  Clone this repository
2.  Create a `feature/*` branch off of `master`
3.  Make your changes
4.  Update unit tests
5.  Format source code using `npm run fmt`
6.  Test your work using `npm run lint && npm test`
7.  Commit and push your changes to the `feature/*` branch
8.  Open a pull-request to `master`
9.  Ensure that Jenkins reports unit-tests are successful on the PR
10. Get your PR reviewed and approved
11. Merge your PR. Delete the `feature/*` branch once done
12. Bump the package version using `git checkout master && git pull && git fetch -pP && npm version minor`
13. Run `npm publish` to publish the package to GitHub
14. Update consumers of this package to use the newly published version

* * *
