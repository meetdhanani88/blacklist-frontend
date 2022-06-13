import { Paper, Grid, Container, Button, Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import img from "../../../Images/undraw_online_stats_0g94.png";
import { imgurl } from "../../../../configs";

const BlacklistedDetails = () => {
  const [vendor, setVendor] = useState("");
  const navigate = useNavigate();
  const { code } = useParams();
  const userlist = useSelector((state) => state.Login.blacklistedvendorlist);

  useEffect(() => {
    const data = userlist.filter((item) => item._id === code);

    setVendor(data[0]);
  }, [code, userlist]);

  const classes = {
    btnWrapper: {
      backgroundColor: "#1976d2",
      width: "fit-content",
      minWidth: "100px",
    },
    btnBack: {
      width: "100%",
      backgroundColor: "#fff",
      "&:hover": {
        color: "#fff",
        backgroundColor: "primary.main",
      },
    },
    borderItem: {
      padding: "5px 15px",
      backgroundColor: "#fff",
    },
  };

  return (
    <Container style={{ marginTop: "40px", textAlign: "start" }}>
      <Paper sx={classes.btnWrapper}>
        <Button
          onClick={() => navigate("/user")}
          sx={classes.btnBack}
          startIcon={<ArrowBackIcon></ArrowBackIcon>}>
          Back
        </Button>
      </Paper>

      {vendor && (
        <Grid container spacing={5} style={{ marginTop: "50px" }}>
          <Grid item xs={12} sm={6} md={6}>
            <img src={img} height="100%" width="100%" alt="Flag" />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <div className="info-box">
              <div>
                <h3>{vendor.vendorName}</h3>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ul className="info-list">
                      <li>
                        <span>Vendor Name:</span> {vendor.vendorName}
                      </li>
                      <li>
                        <span>Address:</span> {vendor.address}
                      </li>
                      <li>
                        <span>Reason to Blacklist:</span> {vendor.reason}
                      </li>
                      <li>
                        <span>Date of Blacklist:</span>{" "}
                        {new Date(vendor.createdAt).toISOString().substring(0, 10)}
                      </li>
                      <li>
                        {vendor.image ? (
                          <Link
                            href={`${imgurl}/${vendor.image}`}
                            underline="hover"
                            target="_blank"
                            rel="noreferrer">
                            Photo Proof
                          </Link>
                        ) : (
                          <p>No Photo Proof</p>
                        )}
                      </li>
                    </ul>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default BlacklistedDetails;
