"use client";

import { Menu } from "@base-ui/react/menu";

import styles from "./SelectMenu.module.scss";

export type SelectMenuOption<T extends string> = {
  description?: string;
  label: string;
  value: T;
};

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function SelectMenu<T extends string>({
  align = "start",
  className,
  menuAriaLabel,
  onValueChange,
  options,
  side = "top",
  sideOffset = 10,
  triggerAriaLabel,
  triggerLabel,
  value,
}: {
  align?: "start" | "center" | "end";
  className?: string;
  menuAriaLabel?: string;
  onValueChange: (value: T) => void;
  options: readonly SelectMenuOption<T>[];
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  triggerAriaLabel: string;
  triggerLabel: string;
  value: T;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={triggerAriaLabel}
        className={cx(styles.trigger, className)}
        type="button"
      >
        <span className={styles.triggerLabel}>{triggerLabel}</span>
        <span aria-hidden="true" className={styles.triggerChevron}>
          ▾
        </span>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner
          align={align}
          className={styles.positioner}
          side={side}
          sideOffset={sideOffset}
        >
          <Menu.Popup className={styles.popup}>
            <Menu.Viewport className={styles.viewport}>
              <Menu.RadioGroup
                aria-label={menuAriaLabel}
                className={styles.list}
                value={value}
                onValueChange={(nextValue) => onValueChange(nextValue as T)}
              >
                {options.map((option) => (
                  <Menu.RadioItem
                    key={option.value}
                    className={styles.item}
                    closeOnClick
                    value={option.value}
                  >
                    <span className={styles.itemContent}>
                      <span className={styles.itemLabel}>{option.label}</span>
                      {option.description ? (
                        <span className={styles.itemDescription}>{option.description}</span>
                      ) : null}
                    </span>
                    <Menu.RadioItemIndicator className={styles.itemIndicator} keepMounted>
                      ✓
                    </Menu.RadioItemIndicator>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Viewport>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
