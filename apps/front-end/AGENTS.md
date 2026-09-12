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
