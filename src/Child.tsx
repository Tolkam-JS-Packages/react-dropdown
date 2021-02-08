import { PureComponent, HTMLProps, createElement, SyntheticEvent } from 'react';
import { classNames } from '@tolkam/lib-utils-ui';
import DropdownContext, { TContext } from './context';
import InViewTracker from '@tolkam/lib-in-view';
import { omit } from '@tolkam/lib-utils';

class Child extends PureComponent<IProps, any> {

    /**
     * @type DropdownContext
     */
    public static contextType = DropdownContext;

    /**
     * @type HTMLElement | null
     */
    public el: HTMLElement | null;

    /**
     * @type InViewTracker
     */
    protected tracker: InViewTracker;

    /**
     * @param props IProps
     * @param context TContext
     */
    public constructor(props: IProps, context: TContext) {
        super(props);
        context.register(this);
    }

    /**
     * @inheritDoc
     */
    public componentDidUpdate(prevProps: Readonly<IProps>) {
        const that = this;
        const {el, props, tracker} = that;

        tracker && tracker.stop();

        if(!props.isTrigger && el && props.active !== prevProps.active) {
            that.tracker = new InViewTracker(el, that.context.onVisibilityUpdate);
            that.tracker.recalculate();
        }
    }

    /**
     * @inheritDoc
     */
    public componentWillUnmount() {
        this.tracker && this.tracker.stop();
    }

    /**
     * @inheritDoc
     */
    public render(): any {
        const {props, onEvent} = this;

        if(!props.isTrigger && !props.active) {
            return null;
        }

        const wrapProps: any = {
            ref: (r: HTMLElement) => this.el = r,
            className: classNames(props.className, {
                [(props.classPrefix || 'child') + '-active']: props.active
            }),
            ...omit(props, ['isTrigger', 'classPrefix', 'active']),
        };

        if(props.isTrigger) {
            wrapProps.onClick = wrapProps.onKeyUp = onEvent;
        }

        return createElement(
            props.isTrigger ? 'a' : 'div',
            wrapProps,
            props.children
        );
    }

    /**
     * Handles element events
     */
    protected onEvent = (e: SyntheticEvent<MouseEvent | KeyboardEvent>) => {
        const props = this.props;
        const event = e.nativeEvent;

        if(props.active || event instanceof KeyboardEvent && event.key !== 'Enter') {
            return;
        }

        this.context.onTriggerEvent();
    }
}

interface IProps extends HTMLProps<Child> {
    // whether child is a trigger
    // for other children in group
    isTrigger?: boolean;

    classPrefix?: string;

    active?: boolean;
}

export default Child;
export {IProps}
