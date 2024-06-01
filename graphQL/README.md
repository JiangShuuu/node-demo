# init

[apollo](https://www.apollographql.com/docs/apollo-server/getting-started/)
[sandbox](https://studio.apollographql.com/sandbox/explorer)

## Call Methods

```Query
query ReviewQuery($id: ID!) {
  review(id: $id) {
    rating,
    game {
      title,
      platform
       reviews {
        rating
      }
    }
    author {
      name,
      verified
    }
  }
}
```

```Delete
mutation DeleteMutation($id: ID!) {
  deleteGame(id: $id) {
    id,
    title,
    platform
  }
}
```

```Add
mutation AddMutation($game: AddGameInput!) {
  addGame(game: $game) {
    id,
    title,
    platform
  }
}
```

```Put
mutation EditMutation($edits: EditGameInput!, $id: ID!) {
  updateGame(edits: $edits, id: $id) {
    title,
    platform
  }
}
```
