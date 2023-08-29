import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
//import { DATEONLY } from "sequelize";

export default class Evaluation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluations: [],
      employee: [],
      indicators: [],
      selectedEmployee: null,
      selectedIndicator: null,
      indicatorValue: null,
      evaluationDate: null,
      remark: "",
      hasError: false,
      completed: false,

      indicatorSelected: false,
      empId: null,
    };
  }

  empId = null;

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleIndicatorChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });

    this.setState({ indicatorSelected: true });
  };

  handleEmployeeChange = (event) => {
    this.empId = document.querySelector("#empSelector").value;

    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleValueChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });

    console.log(this.state.value);
  };

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/indicator/",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log("Indicator");
        console.log(res.data);
        this.setState({ indicators: res.data });
      })
      .catch((err) => {
        console.log(err);
      });

    axios({
      method: "get",
      url: "/api/users/",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log("Working:::");
        this.setState({ employee: res.data });
        console.log(this.state.employee[0]);
      })
      .catch((err) => {
        console.log("Errosghr");
        console.log(err);
      });

    axios({
      method: "get",
      url: "api/evaluations/",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ evaluations: res.data }, () => {
          console.log("evals", this.state.evaluations);
        });
      })
      .catch((err) => {});
  }

  pushIndicators = () => {
    let items = [];
    this.state.indicators.map((indicator, index) => {
      items.push(
        <option key={index} value={indicator.indicator_name}>
          {indicator.indicator_name}
        </option>
      );
    });
    return items;
  };

  pushEmps = () => {
    let items = [];

    this.state.employee.map((emp, index) => {
      if (emp.role === "ROLE_EMPLOYEE") {
        items.push(
          <option key={index} value={emp.id}>
            {emp.fullName}
          </option>
        );
      }
    });

    return items;
  };

  range = () => {
    let indicator = this.state.indicators.filter((ind) => {
      return ind.indicator_name === this.state.selectedIndicator;
    });

    return `Range: from ${indicator[0].min_value} to ${indicator[0].max_value}`;
  };

  getMaxVal = () => {
    let indicator = this.state.indicators.filter((ind) => {
      return ind.indicator_name === this.state.selectedIndicator;
    });
    return indicator[0].max_value;
  };

  getMinVal = () => {
    let indicator = this.state.indicators.filter((ind) => {
      return ind.indicator_name === this.state.selectedIndicator;
    });
    return indicator[0].min_value;
  };

  onSubmit = (event) => {
    event.preventDefault();

    let newEvaluation = {
      emp_id: this.empId,
      indicator: this.state.selectedIndicator,
      value: this.state.indicatorValue,
      evaluationDate: new Date().toISOString().split("T"),
      remark: this.state.remark,
    };

    axios({
      method: "post",
      url: "api/evaluations/",
      data: newEvaluation,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ hasError: false, completed: true });
      })
      .catch((err) => {
        console.log("Error HEEEEEEER");
        this.setState({ hasError: true, errMsg: err.message });
        window.scrollTo(0, 0);
      });
  };

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px 6px 6px",
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-5">
        {this.state.hasError ? (
          <Alert variant="danger" className="m-3" block>
            {this.state.errMsg}
          </Alert>
        ) : this.state.completed ? (
          <Alert variant="success" className="m-3" block>
            Evaluation has been added.
          </Alert>
        ) : (
          <></>
        )}

        <div className="col-sm-12">
          <Card className="mb-3 main-card">
            <Card.Header>
              <strong>Create Performance Evaluation</strong>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <Form onSubmit={this.onSubmit}>
                  <Form.Group>
                    <Form.Label>Select an employee</Form.Label>
                    <Form.Control
                      as="select"
                      id="empSelector"
                      style={{ width: "50%" }}
                      name="selectedEmployee"
                      value={this.selectedEmployee}
                      onChange={this.handleEmployeeChange}
                      required
                    >
                      <option value="" defaultValue>
                        {" "}
                        Choose employee...
                      </option>
                      {this.pushEmps()}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Select an Indicator</Form.Label>
                    <Form.Control
                      as="select"
                      style={{ width: "50%" }}
                      name="selectedIndicator"
                      value={this.selectedIndicator}
                      onChange={this.handleIndicatorChange}
                      required
                    >
                      <option value="" defaultValue>
                        {" "}
                        Choose indicator...
                      </option>
                      {this.pushIndicators()}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Value{" "}
                      {this.state.indicatorSelected ? (
                        "[" + this.range() + "]"
                      ) : (
                        <></>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="number"
                      max={this.state.indicatorSelected ? this.getMaxVal() : 0}
                      min={this.state.indicatorSelected ? this.getMinVal() : 0}
                      style={{ width: "13%" }}
                      name="indicatorValue"
                      value={this.state.indicatorValue}
                      onChange={this.handleChange}
                      required
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Remark</Form.Label>
                    <Form.Control
                      type="textarea"
                      style={{ width: "50%", height: 100 }}
                      name="remark"
                      value={this.state.remark}
                      onChange={this.handleChange}
                      required
                    ></Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-2">
                    Add Evaluation
                  </Button>
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-3 main-card">
            <Card.Header>
              <strong>Previous evaluations</strong>
            </Card.Header>

            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "Employee ID", field: "emp_id" },
                    { title: "Evaluation date", field: "date" },
                    { title: "Indicator", field: "indicator" },
                    { title: "Value", field: "value" },
                    { title: "Remark", field: "remark" },
                  ]}
                  data={this.state.evaluations}
                  title="Performance Evaluations"
                ></MaterialTable>
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
