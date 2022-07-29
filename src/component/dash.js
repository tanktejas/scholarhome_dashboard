import React, { useEffect, useState } from "react";
import "./dash.css";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";

function Navbar() {
  const [userall, setuserall] = useState([]); //for all user
  const [stat, setsta] = useState(false); // for status
  const [curruser, setcurr] = useState(undefined); // curr user
  const [view, setview] = useState(-1);
  const [stat1, settt] = useState(false);

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
        }
      });
    });
  }, []);

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
              <input type="text" placeholder="Search here..." />
            </div>

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
                  {scholarships.map((item) => {
                    return (
                      <>
                        <span class="data-list">{item.name}</span>
                      </>
                    );
                  })}
                </div>

                <div class="data email">
                  <span class="data-title">Email</span>
                  {scholarships.map((item) => {
                    return (
                      <>
                        <span class="data-list">{curruser.email}</span>
                      </>
                    );
                  })}
                </div>
                <div class="data joined">
                  <span class="data-title">Date</span>
                  {scholarships.map((item) => {
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
                  {scholarships.map((item) => {
                    return (
                      <>
                        <span class="data-list">{item.status}</span>
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
