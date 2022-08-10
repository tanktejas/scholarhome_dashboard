import React, { useEffect, useState } from "react";
import "./dash.css";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { updateDoc, deleteField } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import Switch from "@material-ui/core/Switch";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { async } from "@firebase/util";

function Navbar() {
  const [userall, setuserall] = useState([]); //for all user
  const [stat, setsta] = useState(false); // for status
  const [curruser, setcurr] = useState(undefined); // curr user
  const [view, setview] = useState(-1);
  const [stat1, settt] = useState(false);
  const [postedscho, setpos] = useState([]);
  const [permenent, setper] = useState([]);
  const [searchtext, setsear] = useState("");
  const [allscholar, setallscho] = useState([]);

  const par = useParams();
  const adminid = par.adminid;

  useEffect(() => {
    setsta(false);

    const query1 = query(collection(db, "users"));
    onSnapshot(query1, (qS) => {
      console.log(qS.docs[0].data());

      qS.docs.map((item) => {
        if (item.id == adminid) {
          setcurr(item.data());
          setpos(item.data().sc_posted);
          setper(item.data().sc_posted);
          setuserall(qS.docs);

          // this code for fetching views from countapi
          //begin

          let namespace = item?.data()?.namespace;
          let key = item?.data()?.key;

          let url = `https://api.countapi.xyz/get/${namespace}/${key}`;
          fetch(url)
            .then((data1) => {
              return data1.json();
            })
            .then((data1) => {
              setview(data1.value);

              setsta(true);
            });

          //end

          // all scholarships

          const www = query(collection(db, "Scholarships"));

          onSnapshot(www, (qS) => {
            setallscho(qS.docs);
          });
        }
      });
    });
  }, []);

  function funfordeletescho(name) {
    let nn = name;

    const query1 = query(collection(db, "Scholarships"));
    onSnapshot(query1, async (data) => {
      let todelid = "";
      for (let i = 0; i < data.docs.length; i++) {
        const nametomatch = data.docs[i].data().name;
        if (nametomatch == nn) {
          todelid = data.docs[i].id;
        }
      }
      const adminid1 = adminid;

      if (todelid != "") await deleteDoc(doc(db, "Scholarships", todelid));

      const posted = curruser.sc_posted;

      const cityRef2 = doc(db, "users", adminid);
      const yy1 = await updateDoc(cityRef2, {
        sc_posted: posted.filter((item) => {
          return item.name != nn;
        }),
      });
    });
  }

  function searchfil(search) {
    if (search == "") {
      setpos(permenent);
    } else {
      const datta = permenent.filter((item) => {
        return item.name.includes(search);
      });
      setpos(datta);
    }
  }

  async function makethis(name, makethis) {
    const reff = doc(db, "users", adminid);
    const scholar = curruser.sc_posted;

    for (let i = 0; i < scholar.length; i++) {
      if (scholar[i].name == name) {
        scholar[i].status = makethis;
        break;
      }
    }
    const uui = await updateDoc(reff, {
      sc_posted: scholar,
    });

    let idtoupdate = "";

    for (let i = 0; i < allscholar.length; i++) {
      if (allscholar[i].data().name == name) {
        idtoupdate = allscholar[i].id;
        break;
      }
    }

    const reffforsc = doc(db, "Scholarships", idtoupdate);
    const temp = await updateDoc(reffforsc, {
      status: makethis,
    });
  }

  if (!stat) {
    return <h1>Loading...</h1>;
  }

  let name = curruser.name;
  let scholarships = curruser.sc_posted;
  const Posted = curruser.sc_posted.length;

  return (
    <>
      <body>
        <nav>
          <div class="logo-name" id="dashh">
            <div class="logo-image">
              <Avatar sx={{ bgcolor: deepOrange[500] }}>{name[0]}</Avatar>
            </div>
            <span class="logo_name">{name}</span>
          </div>

          <div class="menu-items">
            <ul class="nav-links">
              <li>
                <a href="#">
                  <i class="uil uil-estate"></i>
                  <a href="#dashh">
                    <span class="link-name">Dashboard </span>
                  </a>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="uil uil-files-landscapes"></i>
                  <a href="#statistics">
                    <span class="link-name">Statics</span>
                  </a>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="uil uil-chart"></i>
                  <span class="link-name">Analytics</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="uil uil-thumbs-up"></i>
                  <span class="link-name">Scholarships</span>
                </a>
              </li>
            </ul>

            <ul class="logout-mode">
              <li>
                <a href="#">
                  <i class="uil uil-signout"></i>
                  <span class="link-name">Logout</span>
                </a>
              </li>

              <li class="mode">
                <a href="#">
                  <i class="uil uil-moon"></i>
                  <span class="link-name">Dark Mode</span>
                </a>

                <div
                  class="mode-toggle"
                  onClick={() => {
                    const body = document.querySelector("body");
                    const modeToggle = body.querySelector(".mode-toggle");
                    const sidebar = body.querySelector("nav");
                    const sidebarToggle = body.querySelector(".sidebar-toggle");

                    body.classList.toggle("dark");
                    if (body.classList.contains("dark")) {
                      localStorage.setItem("mode", "dark");
                    } else {
                      localStorage.setItem("mode", "light");
                    }
                  }}
                >
                  <span class="switch"></span>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        <section class="dashboard" id="statistics">
          <div class="top">
            <i
              class="uil uil-bars sidebar-toggle"
              onClick={() => {
                const body = document.querySelector("body");
                const modeToggle = body.querySelector(".mode-toggle");
                const sidebar = body.querySelector("nav");
                const sidebarToggle = body.querySelector(".sidebar-toggle");

                sidebar.classList.toggle("close");
                if (sidebar.classList.contains("close")) {
                  localStorage.setItem("status", "close");
                } else {
                  localStorage.setItem("status", "open");
                }
              }}
            ></i>

            <div class="search-box">
              <i class="uil uil-search"></i>
              <input
                type="text"
                placeholder="Search Posted Scholarship Name here..."
                value={searchtext}
                onChange={(e) => {
                  setsear(e.target.value);
                  searchfil(e.target.value);
                }}
              />
            </div>
            {/* <div className="btnsearch">
              <Button variant="contained" href="#contained-buttons">
                Link
              </Button>
            </div> */}
            {/* <img
              src="http://raw.githubusercontent.com/tanktejas/hackathon/master/src/Components/dash/Images/profile.jpg"
              alt=""
            /> */}
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{name[0]}</Avatar>
          </div>

          <div class="dash-content">
            <div class="overview">
              <div class="title">
                <i class="uil uil-tachometer-fast-alt"></i>
                <span class="text">Dashboard</span>
              </div>

              <div class="boxes">
                <div class="box box1">
                  <i class="uil uil-thumbs-up"></i>
                  <span class="text">Total Scholarship Posted</span>
                  <span class="number">{Posted}</span>
                </div>
                <div class="box box2">
                  <i class="uil uil-comments"></i>
                  <span class="text">Total Scholarships View</span>
                  <span class="number">{view}</span>
                </div>
                <div class="box box3">
                  <i class="uil uil-share"></i>
                  <span class="text">Average Result</span>
                  <span class="number">79%</span>
                </div>
              </div>
            </div>

            <div class="activity">
              <div class="title">
                <i class="uil uil-clock-three"></i>
                <span class="text">Recent Posted Scholarships</span>
              </div>

              <div class="activity-data">
                <div class="data names">
                  <span class="data-title">Name</span>
                  {postedscho.map((item) => {
                    return (
                      <>
                        <span class="data-list">{item.name}</span>
                      </>
                    );
                  })}
                </div>

                <div class="data email">
                  <span class="data-title">Email</span>
                  {postedscho.map((item) => {
                    return (
                      <>
                        <span class="data-list">{curruser.email}</span>
                      </>
                    );
                  })}
                </div>
                <div class="data joined">
                  <span class="data-title">Date</span>
                  {postedscho.map((item) => {
                    return (
                      <>
                        <span class="data-list">
                          {item.date.toDate().toLocaleDateString().toString()}
                        </span>
                      </>
                    );
                  })}
                </div>

                <div class="data status">
                  <span class="data-title">Status</span>
                  {postedscho.map((item) => {
                    return (
                      <>
                        <span class="data-list">
                          {item.status + " "}{" "}
                          <span>
                            <Switch
                              checked={item.status == "active"}
                              onChange={(e) => {
                                let make =
                                  item.status == "active"
                                    ? "deactive"
                                    : "active";

                                makethis(item.name, make);
                              }}
                            />
                          </span>
                        </span>
                      </>
                    );
                  })}
                </div>

                <div class="data Remove">
                  <span class="data-title">Remove</span>
                  {postedscho.map((item) => {
                    return (
                      <>
                        <span class="data-list">
                          <Button
                            variant="outlined"
                            color="error"
                            className="deletebut"
                            onClick={() => {
                              funfordeletescho(item.name);
                            }}
                          >
                            Delete
                          </Button>
                        </span>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </>
  );
}

export default Navbar;
