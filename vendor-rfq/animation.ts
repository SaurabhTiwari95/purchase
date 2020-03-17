import {
  trigger,
  animate,
  style,
  group,
  query,
  transition
} from "@angular/animations";

export const anima = trigger("vendor-rfq", [
  transition("V => C", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(100%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ])
  ]),
  transition("C => V", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(+100%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.3s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ])
  ]),
]);