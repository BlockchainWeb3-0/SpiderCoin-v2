import React from "react";
import { Button, FormControl } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <div>
            <Navbar bg="dark" collapseOnSelect expand="lg" variant="dark">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        Spider Coin 🕷
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: "500px" }}
                            navbarScroll
                        >
                            <Nav.Link as={Link} to="/blocks">
                                Blocks
                            </Nav.Link>
                            <Nav.Link as={Link} to="/wallet">
                                Wallet
                            </Nav.Link>
                            <NavDropdown
                                title="Transaction"
                                id="navbarScrollingDropdown"
                                menuVariant="dark"
                            >
                                <NavDropdown.Item
                                    as={Link}
                                    to="/transaction/mempool"
                                >
                                    Mem Pool
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    as={Link}
                                    to="/transaction/send"
                                >
                                    send
                                </NavDropdown.Item>
                                {/* <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="#action5">
                                    Something else here
                                </NavDropdown.Item> */}
                            </NavDropdown>
                            <Nav>
                                <Nav.Link as={Link} to="/user/signin">
                                    Sign in
                                </Nav.Link>
                                <Nav.Link as={Link} to="/user/signup">
                                    Sign up
                                </Nav.Link>
                            </Nav>
                        </Nav>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search address"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-secondary">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavBar;
