import React from "react";

function CardStudent() {
  const students = [
    {
      name: "Trần Ngọc Chí Thành",
      classInfo: "5B / TH Lê Hồng Phong",
      details: [
        "Hẻm 104/1 Trần Xuân Soạn → Tiểu học Lê Hồng Phong",
        "Thời gian dự kiến đến trạm: 6:40",
        "Thời gian dự kiến đến trường: 7:00",
        "Tài xế: Nguyễn Hải Đăng 1999",
        "Biển số xe: 54K3 - 46469",
      ],
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.469294125748!2d106.699!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f401b2a1c13%3A0xe38b3a501f9b4374!2zVGjDoG5oIFBoxrDhu51uZyBMw6ogSMOgbmcgUGhvbmch!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
    },
    {
      name: "Trần Trọng Duy",
      classInfo: "6C / THCS Lê Quý Đôn",
      details: [
        "Hẻm 104/1 Trần Xuân Soạn → THCS Lê Quý Đôn",
        "Thời gian dự kiến đến trạm: 6:45",
        "Thời gian dự kiến đến trường: 7:00",
        "Tài xế: Trần Hữu Nam 1989",
        "Biển số xe: 59L2 - 98234",
      ],
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.416547708651!2d106.698!3d10.779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3b7e4e99d3%3A0xd3b725e1bb10fddf!2zVHLhuqduIFRydW5nIFBow7NhIFRl!5e0!3m2!1svi!2s!4v1700000000001!5m2!1svi!2s",
    },
  ];

  return (
    <main className="container my-4">
      {students.map((s, i) => (
        <div className="card mb-4 shadow-sm border-0 rounded-3" key={i}>
          <div className="row g-0">
            <div className="col-md-6 p-4" style={{ marginLeft: "-40px" }}>
              <h5 className="fw-bold text-primary">
                + {s.name}{" "}
                <span className="text-dark fw-normal">- {s.classInfo}</span>
              </h5>
              <ul className="mt-3 list-unstyled">
                {s.details.map((d, j) => (
                  <li key={j} className="mb-2 text-secondary">
                    • {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              <iframe
                title={`map-${i}`}
                src={s.mapUrl}
                width="100%"
                height="250"
                className="border-0 rounded-end"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}

export default CardStudent;
