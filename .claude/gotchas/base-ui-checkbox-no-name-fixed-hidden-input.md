# base-ui Checkbox without `name` renders a `position: fixed` hidden input (scroll jump)

`@base-ui/react` `Checkbox.Root` always renders a visually-hidden `<input type="checkbox">`
for form participation. Its style is chosen by whether `name` is set:

```js
style: name ? visuallyHiddenInput : visuallyHidden;
// visuallyHiddenInput -> position: absolute   (contained at the checkbox)
// visuallyHidden      -> position: fixed; top: 0; left: 0   (pinned to viewport corner)
```

When the checkbox lives inside a scroll container (e.g. our `DialogContent`, which is
`max-h-[85vh] overflow-y-auto`) and `name` is omitted, toggling it moves focus through
that `position: fixed` input and the browser scrolls the container trying to reconcile
it - the dialog visibly jumps on every click.

## Fix

Pass a `name` so base-ui uses the contained `position: absolute` variant. For RHF
`Controller` checkboxes, `field.name` is the natural value:

```tsx
<Controller
  control={control}
  name="isDefault"
  render={({ field }) => (
    <Checkbox name={field.name} checked={field.value} onCheckedChange={field.onChange} />
  )}
/>
```

The extra named input is harmless: our forms submit via RHF `handleSubmit` (JS), not
native form submission, and `onCheckedChange` still drives `field.onChange`.

Seen with `@base-ui/react@1.7.0`.
