import { PureComponent, HTMLProps, Children as ReactChildren, cloneElement, isValidElement, ComponentElement, createElement } from 'react';
import { IVisibility } from '@tolkam/lib-in-view';
import { omit, shallowEqual } from '@tolkam/lib-utils';
import { classNames } from '@tolkam/lib-utils-ui';
import DropdownContext from './context';
import Child, {IProps as IChildProps} from './Child';

const initVisibility = {
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
};

class Root extends PureComponent<IProps, IState> {

    /**
     * @type IProps
     */
    public static defaultProps = {
        defaultActive: false,
    }

    /**
     * @type IState
     */
    public state = {
        active: false,
        v: initVisibility,

    } as IState

    /**
     * @type Child
     */
    protected trigger: Child;

    /**
     * @type Child
     */
    protected items: Child;

    public constructor(props: IProps) {
        super(props);
        const active = props.defaultActive as boolean;

        this.state.active = active;
        this.subscribe(active);
    }

    /**
     * Registers child
     *
     * @param child Child
     */
    public register(child: Child) {
        const key = child.props.isTrigger ? 'trigger' : 'items';

        // register each type once
        if(!this[key]) {
            this[key] = child;
        }
    }

    /**
     * Handles trigger events
     */
    public onTriggerEvent = () => {
        this.toggle(!this.state.active);
    }

    /**
     * Tracks child visibility changes
     * @param v IVisibility
     */
    public onVisibilityUpdate = (v: IVisibility) => {
        // no changes or fully visible
        if(
            shallowEqual(v, this.state.v)
            || Object.values(v).filter(v => v !== true).length === 0
        ) {
            return;
        }

        this.setState({v});
    }

    /**
     * @inheritDoc
     */
    public render() {
        const that = this;
        const {props, state} = that;
        const {active, v} = state;

        let classPrefix = props.classPrefix;
        classPrefix = classPrefix !== undefined ? classPrefix : '';
        const className = classNames(props.className, {
            [classPrefix + '-active']:  active,
            [classPrefix + '-right']:  active && !v.topRight && !v.bottomRight,
        });

        const wrapProps: any = {
            ...omit(that.props, ['classPrefix', 'defaultActive', 'tagName']),
            className,
        };

        return <DropdownContext.Provider value={that}>
            {createElement(props.tagName || 'div', wrapProps, that.applyProps(that.props.children))}
        </DropdownContext.Provider>;
    }

    /**
     * Toggles visibility
     */
    protected toggle = (active: boolean) => {
        const that = this;

        that.subscribe(active);

        that.setState({
            active,
            v: initVisibility as IVisibility
        });
    }

    /**
     * Handles document events
     *
     * @param e
     */
    protected onEvents = (e: MouseEvent | KeyboardEvent) => {

        if(!this.state.active || e instanceof KeyboardEvent && e.key !== 'Escape') {
            return;
        }

        const itemsEl = this.items?.el;
        const target = e.target as HTMLElement;
        if(this.trigger?.el !== target && itemsEl && !itemsEl.contains(target)) {
            this.toggle(false);
        }
    }

    /**
     * Adds or removes document click listener
     *
     * @param state boolean
     */
    protected subscribe(state: boolean) {
        for(const e of ['click', 'keyup']) {
            document[(state ? 'add' : 'remove') + 'EventListener'](e, this.onEvents, {capture: true});
        }
    }

    /**
     * Injects props into children
     *
     * @param children
     *
     * @return TChildren
     */
    protected applyProps(children: TChildren): TChildren | null {

        const mapper = (child: TChild) => {

            if(!isValidElement(child) || child.type !== Child) {
                if(process.env.NODE_ENV !== 'production') {
                    throw new Error('Invalid dropdown child: ' + child.type);
                }
            }

            return cloneElement(child, {
                active: this.state.active,
            });
        }

        return ReactChildren.count(children) > 1
            ? ReactChildren.map(children, mapper)
            : mapper(children as TChild);
    }
}

type TChild = ComponentElement<IChildProps, Child>;
type TChildren = TChild | TChild[];

interface IProps extends HTMLProps<Root> {

    children: TChildren;

    defaultActive?: boolean;

    tagName?: string;

    // visibility classes prefix
    classPrefix?: string;
}

interface IState {
    active: boolean;
    v: IVisibility;
}

export default Root;
