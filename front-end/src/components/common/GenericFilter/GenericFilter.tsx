import { useEffect, useMemo } from "react";

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

import type {
  GenericFilterProps,
  GenericFilterStateValue,
} from "./types";

function GenericFilter<T>({
  model,
  filter,
  hasInput = true,
  hasIsLimited = true,
  className,
}: GenericFilterProps<T>) {
  const visibleFields = useMemo(
    () =>
      model.fields.filter((field) => {
        if (field.hidden) return false;
        if (!hasIsLimited && field.key === "limited") return false;
        return true;
      }),
    [hasIsLimited, model.fields]
  );
  const autocompleteFields = useMemo(
    () => visibleFields.filter((field) => field.kind === "autocomplete"),
    [visibleFields]
  );
  const selectFields = useMemo(
    () => visibleFields.filter((field) => field.kind === "select"),
    [visibleFields]
  );
  const booleanFields = useMemo(
    () => visibleFields.filter((field) => field.kind === "boolean"),
    [visibleFields]
  );

  const datalistIdByKey = useMemo(
    () =>
      model.fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.key] = `generic-filter-list-${field.key}`;
        return acc;
      }, {}),
    [model.fields]
  );

  function updateValue(key: string, value: GenericFilterStateValue) {
    filter.setFilterValue(key, value);
  }

  useEffect(() => {
    if (!hasIsLimited && filter.filterState.limited !== null) {
      filter.setFilterValue("limited", null);
    }
  }, [filter, hasIsLimited]);

  return (
    <section
      className={cn(
        "rounded-md border border-border bg-muted/30 p-4",
        className
      )}
      aria-label="Filtres"
    >
      <div className="flex flex-col gap-4">
        {autocompleteFields.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {autocompleteFields.map((field) => {
              const currentValue = filter.filterState[field.key];
              const id = `generic-filter-${field.key}`;
              const options = filter.autocompleteOptions[field.key] ?? [];
              const datalistId = datalistIdByKey[field.key];

              return (
                <div key={field.key} className={cn("w-1/2", field.className)}>
                  <Label htmlFor={id}>{field.label}</Label>
                  {hasInput ? (
                    <>
                      <Input
                        id={id}
                        list={datalistId}
                        value={typeof currentValue === "string" ? currentValue : ""}
                        placeholder={field.placeholder ?? "Rechercher..."}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        disabled={field.disabled}
                        className="mt-2"
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
                        <SelectValue placeholder={field.noOptionsLabel ?? "Tous"} />
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
          </div>
        ) : null}

        {selectFields.length > 0 ? (
          <div className="flex flex-nowrap items-end justify-start gap-[20px] overflow-x-auto">
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
                    "w-[30%] min-w-[220px] shrink-0",
                    field.className
                  )}
                >
                  <Label htmlFor={id}>{field.label}</Label>
                  <Select
                    value={normalizedValue}
                    onValueChange={(value) =>
                      updateValue(field.key, value === "__all__" ? null : value)
                    }
                    disabled={field.disabled}
                  >
                    <SelectTrigger id={id} className="mt-2">
                      <SelectValue placeholder={field.allLabel ?? "Tous"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">
                        {field.allLabel ?? "Tous"}
                      </SelectItem>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
                field.className
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={filter.resetFilters}
          >
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}

export { GenericFilter };
