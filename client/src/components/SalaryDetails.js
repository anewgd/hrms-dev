import React, { Component } from "react";
import { Card, Button, Form, Alert, Badge } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import JobAddModal from "./JobAddModal";
import JobEditModal from "./JobEditModal";
import JobDeleteModal from "./JobDeleteModal";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import AlertModal from "./AlertModal";

export default class SalaryDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      selectedDepartment: null,
      selectedUser: null,
      financialId: null,
      users: [],
      basicSalary: null,
      grossSalary: 0,
      netSalary: 0,
      allowance: 0,
      incomeTax: 0,
      pensionEmployee: 0,
      pensionCompany: 0,
      totalDeduction: 0,
      hasError: false,
      errMsg: "",
      completed: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/departments",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log(res);
        this.setState({ departments: res.data }, () => {
          if (this.props.location.state) {
            this.setState(
              {
                selectedDepartment:
                  this.props.location.state.selectedUser.departmentId,
              },
              () => {
                this.fetchData();
              }
            );
            this.setState(
              { selectedUser: this.props.location.state.selectedUser.id },
              () => {
                this.pushChanges();
              }
            );
          } else console.log("error here");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  pushChanges = () => {
    axios({
      method: "get",
      url: "api/financialInformations/user/" + this.state.selectedUser,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log("From db", res);
        this.setState((prevState) => ({
          ...prevState,
          financialId: res.data[0].id,
          ...res.data[0],
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchData = () => {
    axios({
      method: "get",
      url: "api/departments/" + this.state.selectedDepartment,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let department = res.data;
        let users = [];

        department.users.map((user) => {
          users.push(user);
        });

        this.setState({ users: users });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchDataAll = () => {
    axios({
      method: "get",
      url: "api/departments/",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let departments = res.data;
        let users = [];

        departments.map((dept) => {
          dept.users.map((user) => {
            users.push(user);
          });
        });

        this.setState({ users: users });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  pushDepartments = () => {
    let items = [];
    items.push(
      <option key={584390} value="all">
        All departments
      </option>
    );
    this.state.departments.map((dept, index) => {
      if (this.state.selectedDepartment == dept.id) {
        items.push(
          <option key={index} value={dept.id} defaultValue>
            {dept.departmentName}
          </option>
        );
      } else {
        items.push(
          <option key={index} value={dept.id}>
            {dept.departmentName}
          </option>
        );
      }
    });
    return items;
  };

  pushUsers = () => {
    let items = [];

    this.state.users.map((user, index) => {
      items.push(
        <option key={index} value={user.id}>
          {user.fullName}
        </option>
      );
    });

    return items;
  };

  handleDepartmentChange = (event) => {
    this.setState({ selectedDepartment: event.target.value }, () => {
      if (this.state.selectedDepartment === "all") {
        this.fetchDataAll();
      } else {
        this.fetchData();
      }
    });
  };

  handleUserChange = (event) => {
    this.state.users.map((user) => {
      if (user.id == event.target.value) {
        this.setState({ selectedUser: event.target.value }, () => {
          axios({
            method: "get",
            url: "api/financialInformations/user/" + this.state.selectedUser,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => {
              this.setState((prevState) => ({
                ...prevState,
                financialId: res.data[0].id,
                ...res.data[0],
              }));
            })
            .catch((err) => {
              console.log("Error:");
              console.log(err);
            });
        });
      }
    });
  };

  handleChangeEmploymentType = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: +value,
    });

    console.log(name, ":", value);
  };

  handleBasicSalaryChange = (event) => {
    const { name, value } = event.target;
    this.setState(
      {
        [name]: +value,
      },
      () => {
        this.setState(
          {
            pensionCompany: +(this.state.basicSalary * 0.11),
            pensionEmployee: +(this.state.basicSalary * 0.07),
            allowance: 2200,
            incomeTax: +this.calculateIncomeTax(this.state.basicSalary),
          },
          () => {
            this.setState({
              grossSalary: +(
                this.state.basicSalary +
                this.state.allowance +
                this.state.pensionCompany
              ),
              totalDeduction:
                this.state.incomeTax +
                this.state.pensionCompany +
                this.state.pensionEmployee,
              netSalary: this.calculateNetSalary(
                this.state.basicSalary,
                this.state.incomeTax,
                this.state.allowance,
                this.state.pensionEmployee
              ),
            });
          }
        );
      }
    );
  };

  calculateNetSalary = (basic, tax, allowance, pension) => {
    console.log("net: ", basic - tax - pension + allowance);
    return basic - tax - pension + allowance;
  };

  calculateIncomeTax = (basicSalary) => {
    if (basicSalary <= 600) return 0;
    else if (basicSalary > 600 && basicSalary <= 1650)
      return basicSalary * 0.1 - 60;
    else if (basicSalary > 1650 && basicSalary <= 3200)
      return basicSalary * 0.15 - 142.5;
    else if (basicSalary > 3200 && basicSalary <= 5250)
      return basicSalary * 0.2 - 302.5;
    else if (basicSalary > 5250 && basicSalary <= 7800)
      return basicSalary * 0.25 - 565;
    else if (basicSalary > 7800 && basicSalary <= 10900)
      return basicSalary * 0.3 - 955;
    else if (basicSalary > 10900) return basicSalary * 0.35 - 1500;
    else return null;
  };
  onSubmit = (event) => {
    event.preventDefault();

    let data = {
      employmentType: this.state.employmentType,
      basicSalary: this.state.basicSalary,
      grossSalary:
        this.state.basicSalary +
        this.state.allowance +
        this.state.pensionCompany,
      netSalary: this.state.netSalary,
      allowance: this.state.allowance,
      incomeTax: this.state.incomeTax,
      pensionEmployee: this.state.pensionEmployee,
      pensionCompany: this.state.pensionCompany,
      totalDeduction: this.state.totalDeduction,
      userId: this.state.selectedUser,
    };

    console.log(data);
    axios({
      method: "put",
      url: "api/financialInformations/" + this.state.financialId,
      data: data,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ completed: true });
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        this.setState({ hasError: true, errMsg: err.response.data.message });
        window.scrollTo(0, 0);
      });
  };

  onEdit(job) {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedJob: job, showEditModel: true });
    };
  }

  setValues = () => {
    this.setState({
      pensionCompany: this.state.basicSalary * 0.11,
    });

    console.log(this.state.basicSalary, " ", this.state.pensionCompany);
  };

  render() {
    let grossSalary =
      this.state.basicSalary + this.state.allowance + this.state.pensionCompany;

    let totalDeduction =
      this.state.incomeTax +
      this.state.pensionCompany +
      this.state.pensionEmployee;

    let netSalary = grossSalary - totalDeduction;

    return (
      <div className="container-fluid pt-2">
        <div className="row">
          {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
          ) : this.state.completed ? (
            <Alert variant="success" className="m-3" block>
              Financial Infromation have been updated.
            </Alert>
          ) : (
            <></>
          )}

          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <div className="required">Manage Salary Details</div>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                      <Form.Label>Select Department: </Form.Label>
                      <Form.Control
                        as="select"
                        className="select-css"
                        value={this.state.selectedDepartment}
                        onChange={this.handleDepartmentChange}
                      >
                        <option key={34432432} value="">
                          Choose one...
                        </option>
                        {this.pushDepartments()}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Select User: </Form.Label>
                      <Form.Control
                        as="select"
                        className="select-css"
                        value={this.state.selectedUser || ""}
                        onChange={this.handleUserChange}
                      >
                        <option value="">Choose one...</option>
                        {this.pushUsers()}
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
        {this.state.selectedUser ? (
          <Form onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col-sm-12">
                <Card className="main-card">
                  <Card.Header>Salary Details</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <Form.Group>
                        <Form.Label className="required">
                          Employment Type{" "}
                        </Form.Label>
                        <Form.Control
                          as="select"
                          className="select-css"
                          value={this.state.employmentType}
                          onChange={this.handleChangeEmploymentType}
                          name="employmentType"
                        >
                          <option value="">Choose one...</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="required">
                          Basic Salary
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.basicSalary}
                          onChange={this.handleBasicSalaryChange}
                          name="basicSalary"
                        />
                      </Form.Group>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                {/* <Card className="main-card">
                  <Card.Header>Allowances</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <Form.Group>
                        <Form.Label>Transport Allowance</Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.allowance}
                          onChange={this.handleChange}
                          name="allowance"
                        />
                      </Form.Group>
                      {/* <Form.Group>
                        <Form.Label>Medical Allowance</Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.allowanceMedical}
                          onChange={this.handleChange}
                          name="allowanceMedical"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Special Allowance</Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.allowanceSpecial}
                          onChange={this.handleChange}
                          name="allowanceSpecial"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Fuel Allowance</Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.allowanceFuel}
                          onChange={this.handleChange}
                          name="allowanceFuel"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Phone Bill Allowance</Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.allowancePhoneBill}
                          onChange={this.handleChange}
                          name="allowancePhoneBill"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Other Allowance</Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.allowanceOther}
                          onChange={this.handleChange}
                          name="allowanceOther"
                        />
                      </Form.Group>
                    </Card.Text>
                  </Card.Body>
                </Card> */}
              </div>
              <div className="col-sm-6">
                <div className="row">
                  {/* <div className="col-sm-12">
                    <Card className="main-card">
                      <Card.Header>Deductions</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <Form.Group>
                            <Form.Label>Tax Deduction</Form.Label>
                            <Form.Control
                              type="number"
                              value={this.state.deductionTax}
                              onChange={this.handleChange}
                              name="deductionTax"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Other Deduction</Form.Label>
                            <Form.Control
                              type="number"
                              value={this.state.deductionOther}
                              onChange={this.handleChange}
                              name="deductionOther"
                            />
                          </Form.Group>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <Card className="main-card">
                      <Card.Header>Total Salary Details</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <Form.Group>
                            <Form.Label>Gross Salary</Form.Label>
                            <Form.Control
                              type="number"
                              name="grossSalary"
                              value={this.state.grossSalary}
                              //onChange={this.handleChange}
                              //readOnly
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Total Deductions</Form.Label>
                            <Form.Control
                              type="number"
                              name="totalDeduction"
                              value={this.state.totalDeduction}
                              //onChange={this.handleChange}
                              //readOnly
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Net Salary</Form.Label>
                            <Form.Control
                              type="number"
                              name="netSalary"
                              value={this.state.netSalary}
                              //onChange={this.handleChange}
                              //readOnly
                            />
                          </Form.Group>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                <div className="row mb-2">
                  <Button type="submit" block>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        ) : null}
      </div>
    );
  }
}
