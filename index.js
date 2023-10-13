import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import * as postmark from "postmark"

const app = express();

app.use(express.json());
app.use(cors());

app.post("/", async (req,res) => {
  if(req.body.secretToken!==process.env.SECRET_TOKEN) return res.status(401).json('Unauthorized.');
  if(!req.body.email) return res.status(401).json('Must post email');
  const { Bcc, Cc, HtmlBody, Subject, To, From } = req.body.email;
  if(!To || !HtmlBody || !From) return res.status(401).json("Must include 'to', 'body', and 'from'.")
  const emailClient = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  const genEmail = await emailClient.sendEmail(req.body.email);
  res.json(genEmail);
})

app.listen(process.env.PORT)