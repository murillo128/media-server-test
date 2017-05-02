// This is nasty, I would love to clean this up

import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

export default class Login extends React.Component {

    constructor() {
        super();

        this.state = {
            value: ''
        };

        this.handleChange.bind(this);
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        const state = this.state;
        const submit = () => {
            console.log('In submit');

            window.localStorage.setItem('user', this.state.value.slice(0, 25));
            window.location.href = '/broadcast';
        }

        const onHandleChange = (e) => { this.handleChange(e) };
        return (
            <div>
                <header>Please Login</header>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>Working example with validation</ControlLabel>
                        <FormControl
                            type="text"
                            value={state.value}
                            placeholder="Enter text"
                            onChange={onHandleChange}
                        />
                        <FormControl.Feedback />
                        <Button onClick={submit}>Login</Button>
                        <HelpBlock>Validation is based on string length.</HelpBlock>
                    </FormGroup>
                </form>
            </div>
        );
    }
}