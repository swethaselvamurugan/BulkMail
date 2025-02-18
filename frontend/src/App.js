import { useState } from "react";
import axios from 'axios';
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("")
  const [status, setStatus] = useState(false)
  const [mailList, setMail] = useState([])

  function handleMsg(event) {
    setmsg(event.target.value)
  }
  function send() {
    setStatus(true)
    axios.post("http://localhost:5000/sendmail", { msg: msg, mailList: mailList }).
      then(function (data) {
        console.log(data.data)
        if (data.data == true) {
          alert("Mail sent successfully.")
          setStatus(false)
          setmsg("")
        }
        else {
          alert("Failed.")
        }
        setStatus(false)
      })
  }
  function handleFile(event) {
    const file = event.target.files[0]

    const reader = new FileReader()

    reader.onload = function (e) {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const workSheet = workbook.Sheets[sheetName]
      const mailList = XLSX.utils.sheet_to_json(workSheet, { header: 'A' })
      const totalMail = mailList.map(function(item){return item.A})
      console.log(totalMail)
      setMail(totalMail)
    }
    reader.readAsBinaryString(file);
  }

  return (
    <div>

      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">Bulk Mail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">We can help your business with sending multiple emails at once</h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handleMsg} value={msg} className="w-[80%] h-32 px-2 py-2 outline-none border border-black rounded-md" placeholder="Enter the email text..."></textarea>
        <div>
          <input onChange={handleFile} type="file" className="border-4 border-dashed px-4 py-4 mt-5 mb-5"></input>
        </div>
        <p>Total Emails in the file: {mailList.length}</p>
        <button onClick={send} className="bg-blue-950 text-white font-medium px-2 py-2 rounded-md w-fit mt-2">{status ? "Sending..." : "Send"}</button>
      </div>

      <div className="bg-blue-300 text-white text-center p-8"></div>
      <div className="bg-blue-200 text-white text-center p-8"></div>

    </div>
  );
}

export default App;
