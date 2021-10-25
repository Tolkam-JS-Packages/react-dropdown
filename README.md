# tolkam/react-dropdown

Simple animatable dropdowns.

## Usage

````tsx
import * as React from 'react';
import { render } from 'react-dom';
import Dropdown from 'D:/dev-packages/js/packages/react-dropdown';

const myComponent = <Dropdown.Root>
    <Dropdown.Child isTrigger>Click me</Dropdown.Child>

    <Dropdown.Child>
        <p>Hello, World!</p>
    </Dropdown.Child>
</Dropdown.Root>

render(myComponent, document.getElementById('app'));
````

## Documentation

The code is rather self-explanatory and API is intended to be as simple as possible. Please, read the sources/Docblock if you have any questions. See [Usage](#usage) for quick start.

## License

Proprietary / Unlicensed 🤷
