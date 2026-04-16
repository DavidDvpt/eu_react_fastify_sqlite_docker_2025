import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { GenericFilterProps, GenericFilterStateValue } from "./types";

function GenericFilter<T>({
  model,
  filter,
  hasInput = true,
  hasIsLimited = true,
  className,
}: GenericFilterProps<T>) {
  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const [isLeftCompact, setIsLeftCompact] = useState(false);
  const [isRightCompact, setIsRightCompact] = useState(false);

  const visibleFields = useMemo(
    () =>
      model.fields.filter((field) => {
        if (field.hidden) return false;
        if (!hasIsLimited && field.key === "limited") return false;
        return true;
      }),
    [hasIsLimited, model.fields],
  );
  const autocompleteFields = useMemo(
    () => visibleFields.filter((field) => field.kind === "autocomplete"),
    [visibleFields],
  );
  const selectFields = useMemo(
    () => visibleFields.filter((field) => field.kind === "select"),
    [visibleFields],
  );
  const booleanFields = useMemo(
    () => visibleFields.filter((field) => field.kind === "boolean"),
    [visibleFields],
  );

  const datalistIdByKey = useMemo(
    () =>
      model.fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.key] = `generic-filter-list-${field.key}`;
        return acc;
      }, {}),
    [model.fields],
  );

  function updateValue(key: string, value: GenericFilterStateValue) {
    filter.setFilterValue(key, value);
  }

  useEffect(() => {
    if (!hasIsLimited && filter.filterState.limited !== null) {
      filter.setFilterValue("limited", null);
    }
  }, [filter, hasIsLimited]);

  useEffect(() => {
    const leftElement = leftColumnRef.current;
    const rightElement = rightColumnRef.current;
    if (!leftElement || !rightElement) return;

    if (typeof ResizeObserver === "undefined") {
      setIsLeftCompact(leftElement.clientWidth < 300);
      setIsRightCompact(rightElement.clientWidth < 300);
      return;
    }

    const observer = new ResizeObserver(() => {
      setIsLeftCompact(leftElement.clientWidth < 300);
      setIsRightCompact(rightElement.clientWidth < 300);
    });

    observer.observe(leftElement);
    observer.observe(rightElement);

    setIsLeftCompact(leftElement.clientWidth < 300);
    setIsRightCompact(rightElement.clientWidth < 300);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={cn(
        "flex flex-col rounded-md border border-card-border bg-card shadow-card p-4 gap-4",
        className,
      )}
      aria-label="Filtres"
    >
      <div className="flex flex-nowrap justify-between">
        <div ref={leftColumnRef} className="flex min-w-0 flex-col w-[49%]">
          {selectFields.length > 0 ? (
            <div className="flex flex-col gap-2">
              {selectFields.map((field) => {
                const currentValue = filter.filterState[field.key];
                const id = `generic-filter-${field.key}`;
                const options = filter.selectOptions[field.key] ?? [];
                const normalizedValue =
                  typeof currentValue === "string" && currentValue
                    ? currentValue
                    : "__all__";

                return (
                  <div
                    key={field.key}
                    className={cn(
                      isLeftCompact
                        ? "w-full min-w-0"
                        : "min-w-[100px] max-w-[60%] shrink-0",
                      field.className,
                    )}
                  >
                    <Label htmlFor={id} className="text-input-label">
                      {field.label}
                    </Label>
                    <Select
                      value={normalizedValue}
                      onValueChange={(value) =>
                        updateValue(
                          field.key,
                          value === "__all__" ? null : value,
                        )
                      }
                      disabled={field.disabled}
                    >
                      <SelectTrigger
                        id={id}
                        className="mt-2 bg-input-bg text-input-text border border-input-border"
                      >
                        <SelectValue placeholder={field.allLabel ?? "Tous"} />
                      </SelectTrigger>
                      <SelectContent className="bg-input-bg text-input-text">
                        <SelectItem
                          value="__all__"
                          className="data-[highlighted]:bg-select-item-hover data-[highlighted]:text-input-text"
                        >
                          {field.allLabel ?? "Tous"}
                        </SelectItem>
                        {options.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="data-[highlighted]:bg-select-item-hover data-[highlighted]:text-input-text"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <div
          ref={rightColumnRef}
          className="flex min-w-0 flex-col w-[49%] gap-4"
        >
          {autocompleteFields.length > 0 &&
            autocompleteFields.map((field) => {
              const currentValue = filter.filterState[field.key];
              const id = `generic-filter-${field.key}`;
              const options = filter.autocompleteOptions[field.key] ?? [];
              const datalistId = datalistIdByKey[field.key];

              return (
                <div
                  key={field.key}
                  className={cn(
                    isRightCompact
                      ? "w-full min-w-0"
                      : "min-w-[100px] max-w-[80%]",
                    field.className,
                  )}
                >
                  <Label htmlFor={id}>{field.label}</Label>
                  {hasInput ? (
                    <>
                      <Input
                        id={id}
                        list={datalistId}
                        value={
                          typeof currentValue === "string" ? currentValue : ""
                        }
                        placeholder={field.placeholder ?? "Rechercher..."}
                        onChange={(event) =>
                          updateValue(field.key, event.target.value)
                        }
                        disabled={field.disabled}
                        className="mt-2 h-9"
                      />
                      <datalist id={datalistId}>
                        {options.map((option) => (
                          <option key={option} value={option} />
                        ))}
                      </datalist>
                    </>
                  ) : (
                    <Select
                      value={
                        typeof currentValue === "string" && currentValue
                          ? currentValue
                          : "__all__"
                      }
                      onValueChange={(value) =>
                        updateValue(field.key, value === "__all__" ? "" : value)
                      }
                      disabled={field.disabled}
                    >
                      <SelectTrigger id={id} className="mt-2">
                        <SelectValue
                          placeholder={field.noOptionsLabel ?? "Tous"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">Tous</SelectItem>
                        {options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          <div className="flex flex-wrap items-center gap-6">
            {booleanFields.map((field) => {
              const currentValue = filter.filterState[field.key];
              const id = `generic-filter-${field.key}`;
              const isChecked = currentValue === true;

              return (
                <label
                  key={field.key}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 text-sm text-foreground",
                    field.className,
                  )}
                >
                  <Checkbox
                    id={id}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      updateValue(field.key, checked === true)
                    }
                    disabled={field.disabled}
                  />
                  {field.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-end">
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="ml-auto w-[100px]"
          onClick={filter.resetFilters}
        >
          Reset
        </Button>
      </div>
    </section>
  );
}

export { GenericFilter };
