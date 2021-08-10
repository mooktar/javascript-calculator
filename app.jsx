const projectName = "JavaScript Calculator";


// Elements of calculator
const ELEMENTS = [
    [
        {
            value: "AC",
            id: "clear",
            type: "clear",
            span: 2,
        },
        {
            value: "CE",
            id: "clear-entry",
            type: "clear-entry",
        },
        {
            value: "/",
            id: "divide",
            type: "operator",
        },
    ],
    [
        {
            value: 7,
            id: "seven",
            type: "number",
        },
        {
            value: 8,
            id: "eight",
            type: "number",
        },
        {
            value: 9,
            id: "nine",
            type: "number",
        },
        {
            value: "*",
            id: "multiply",
            type: "operator",
        },
    ],
    [
        {
            value: 4,
            id: "four",
            type: "number",
        },
        {
            value: 5,
            id: "five",
            type: "number",
        },
        {
            value: 6,
            id: "six",
            type: "number",
        },
        {
            value: "-",
            id: "subtract",
            type: "operator",
        },
    ],
    [
        {
            value: 1,
            id: "one",
            type: "number",
        },
        {
            value: 2,
            id: "two",
            type: "number",
        },
        {
            value: 3,
            id: "three",
            type: "number",
        },
        {
            value: "+",
            id: "add",
            type: "operator",
        },
    ],
    [
        {
            value: 0,
            id: "zero",
            type: "number",
        },
        {
            value: ".",
            id: "decimal",
            type: "decimal",
        },
        {
            value: "=",
            id: "equals",
            type: "equals",
            span: 2,
        },
    ],
];


// Rendering calculator's elements using <table>...</table>
function CalculatorTab({ elements, current, expression, handleClick }) {
    return (
        <table className="table table-dark">
            <thead>
                <tr>
                    <th colspan="4">
                        <small>{expression || ""}</small>
                        <br />
                        <p id="display">{current || 0}</p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {elements.map((items, idr) => (
                    <tr key={idr}>
                        {items.map((item, idc) => (
                            <td
                                key={idc}
                                id={item.id}
                                data-type={item.type}
                                colspan={item.span ? item.span : ""}
                                onClick={handleClick}
                            >
                                {item.value}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expression: "",
            current: ""
        };
        this.handleClick = this.handleClick.bind(this);
    }

    // Handle touch click and set expression and current value
    handleClick(e) {
        const target = e.target;
        const value = target.innerText;
        const { current, expression } = this.state; // get states by destruction
        
        // perform operations by type of touch
        switch (target.dataset.type) {
            case "number":
                if (current != '0' || value != '0') {
                    this.setState({
                        current: current == '0' || /[*/+-]/.test(current)
                            ? value 
                            : current + value,
                        expression: expression == '0'
                            ? value 
                            : /^[+*/]/.test(expression)
                                ? expression.slice(1, expression.length) + value
                                : expression + value,
                    });
                }
                break;

            case "decimal":
                if (current == "" || /[-+*\/]$/.test(current)) {
                    this.setState({
                        current: "0.",
                        expression: expression + "0.",
                    });
                } else if (!current.includes(".")) {
                    this.setState({
                        current: current + value,
                        expression: expression + value,
                    });
                } else if (current.includes(".")) {
                    this.setState({
                        current: current,
                        expression: expression,
                    });
                }
                break;

            case "operator":
                let curExp = expression
                if ((curExp == '' && value != '-') || curExp == '-') {
                    curExp = curExp
                } else if (curExp != '') {
                    if (/[-]$/.test(curExp)) {
                        if (value != '-' && value != '+') {
                            curExp = curExp.slice(0, -1) + value
                        } else {
                            curExp = curExp + value
                        }
                    } else if (/[*/]$/.test(curExp)) {
                        if (value == '-') {
                            curExp = curExp + value
                        } else {
                            curExp = curExp.slice(0, -1) + value
                        }
                    } else if (/[+]$/.test(curExp)) {
                        curExp = curExp.slice(0, -1) + value
                    } else {
                        curExp = curExp + value
                    }
                }
                this.setState({
                    current: value,
                    expression: curExp
                })
                break;
    
            case "equals":
                let formula = expression
                console.log('Expression: ' + formula);
                while (/[-*+/]$/.test(formula)) {
                    formula = formula.slice(0, -1)
                }
                formula = formula.replace(/[.]/g, '.')
                    .replace(/([*+/-])+/g, (m, $1) => m.length > 2 ? $1 : m);
                console.log('Replced: ' + formula);
                try {
                    const result = Math.round(10000 * eval(formula)) / 10000
                    console.log('Result: ' + result);
                    this.setState({
                        current: result,
                        expression: result
                    });
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        alert("⛔ Error: Checkup your formula/expression.")
                    }
                }
                break;

            case "clear":
                this.setState({
                    current: "",
                    expression: "",
                    evaluated: false
                });
                break;
    
            default:
                if (current != '' && expression != '') {
                    this.setState({
                        current: current.slice(0, -1),
                        expression: expression.slice(0, -1),
                    });
                }
                break;
        }
    }

    render() {
        return (
            <div className="calculator__container">
                <h1>JavaScript Calculator</h1>
                <CalculatorTab
                    elements={ELEMENTS}
                    current={this.state.current}
                    expression={this.state.expression}
                    handleClick={this.handleClick}
                />
                <p>
                    Developed with 💗 by{" "}
                    <a href="mailto:mohmouktar@gmail.com">Mooktar</a>.
                </p>
            </div>
        );
    }
}


ReactDOM.render(<App />, document.querySelector("#app"));
