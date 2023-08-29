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
import IndicatorDeleteModal from "./IndicatorDeleteModal";

export default class Indicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      indicators: [],
      indicatorName: "",
      minValue: null,
      maxValue: null,
      interval: "",
      hasError: false,
      completed: false,
      deleteModal: false,

      selectedIndicator: null,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "api/indicator/",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ indicators: res.data }, () => {
          console.log("applications", this.state.indicators);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onDelete = (indicator) => {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedIndicator: indicator, deleteModal: true });
    };
  };

  onSubmit = (event) => {
    event.preventDefault();

    let newIndicator = {
      indicator_name: this.state.indicatorName,
      min_value: this.state.minValue,
      max_value: this.state.maxValue,
      interval: this.state.interval,
    };

    axios({
      method: "post",
      url: "api/indicator",
      data: newIndicator,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ hasError: false, completed: true });
      })
      .catch((err) => {
        this.setState({ hasError: true, errMsg: err.message });
        window.scrollTo(0, 0);
      });
  };

  render() {
    let closeDeleteModel = () => this.setState({ deleteModal: false });

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
        {this.state.deleteModal ? (
          <IndicatorDeleteModal
            show={true}
            onHide={closeDeleteModel}
            data={this.state.selectedIndicator}
          />
        ) : (
          <></>
        )}
        {this.state.hasError ? (
          <Alert variant="danger" className="m-3" block>
            {this.state.errMsg}
          </Alert>
        ) : this.state.completed ? (
          <Alert variant="success" className="m-3" block>
            The new indicator has been added.
          </Alert>
        ) : (
          <></>
        )}
        <div className="col-sm-12">
          <Card className="mb-3 main-card">
            <Card.Header>
              <strong>Create Performance Indicators</strong>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <Form onSubmit={this.onSubmit}>
                  <Form.Group>
                    <Form.Label>Indicator Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="indicatorName"
                      value={this.state.indicatorName}
                      onChange={this.handleChange}
                      style={{ width: "50%" }}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Minimum value</Form.Label>
                    <Form.Control
                      type="number"
                      name="minValue"
                      value={this.state.minValue}
                      onChange={this.handleChange}
                      style={{ width: "50%" }}
                      required
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Maximum value</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxValue"
                      value={this.state.maxValue}
                      onChange={this.handleChange}
                      style={{ width: "50%" }}
                      required
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Interval</Form.Label>
                    <Form.Control
                      as="select"
                      name="interval"
                      value={this.state.interval}
                      onChange={this.handleChange}
                      style={{ width: "50%" }}
                      required
                    >
                      <option value="">Choose one</option>
                      <option value="DAILY">Daily</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                    </Form.Control>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-2">
                    Add
                  </Button>
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-3 main-card">
            <Card.Header>
              <strong>Indicator List</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "Indicator name", field: "indicator_name" },
                    { title: "Minimum Value", field: "min_value" },
                    { title: "Maximum Value", field: "max_value" },
                    { title: "Interval", field: "interval" },
                    {
                      title: "Action",
                      render: (rowdata) => (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={this.onDelete(rowdata)}
                        >
                          Delete
                        </Button>
                      ),
                    },
                  ]}
                  data={this.state.indicators}
                  title="Performance Indicators"
                ></MaterialTable>
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
