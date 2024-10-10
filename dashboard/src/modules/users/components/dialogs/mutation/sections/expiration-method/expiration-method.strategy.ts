import { useFormContext } from "react-hook-form";
import { ExpireStrategy } from "@marzneshin/modules/users";

abstract class ExpirationMethodStrategy {
    protected abstract strategy: string;
    protected abstract applyFieldValues(form: ReturnType<typeof useFormContext>): void;

    protected clearErrors(form: ReturnType<typeof useFormContext>) {
        form.clearErrors("expire_date");
        form.clearErrors("usage_duration");
        form.clearErrors("activation_deadline");
    }

    /**
     * Applied the rules on the form's fields, called by component
     *
     * @param form - form object from the context
     */
    public apply(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire_strategy", this.strategy);
        this.applyFieldValues(form)
        this.clearErrors(form)
    }
}

export class FirstUseStrategy extends ExpirationMethodStrategy {
    strategy = "start_on_first_use";

    protected applyFieldValues(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire", undefined);
    }
}

export class NeverStrategy extends ExpirationMethodStrategy {
    strategy = "never";

    protected applyFieldValues(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire_date", undefined);
        form.setValue("activation_deadline", undefined);
        form.setValue("usage_duration", undefined);
    }
}

export class FixedStrategy extends ExpirationMethodStrategy {
    strategy = "fixed_date";

    protected applyFieldValues(form: ReturnType<typeof useFormContext>) {
        form.setValue("usage_duration", undefined);
        form.setValue("activation_deadline", undefined);
    }
}

export const strategies: { [key in ExpireStrategy]: ExpirationMethodStrategy } = {
    start_on_first_use: new FirstUseStrategy(),
    never: new NeverStrategy(),
    fixed_date: new FixedStrategy(),
};
