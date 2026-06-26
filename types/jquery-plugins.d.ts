// Type augmentations for jQuery plugins used in legacy templates
interface JQuery {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fullpage(options?: any): JQuery
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  velocity(props: any, opts?: any): JQuery
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  owlCarousel(opts?: any): JQuery
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip(opts?: any): JQuery
}

interface JQueryStatic {
  fn: JQuery & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullpage: any
  }
}
