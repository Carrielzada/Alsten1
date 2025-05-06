import { Router } from "express";
import LogsCtrl from "../Controle/logsCtrl.js";

const rotaLogs = new Router();
const logsCtrl = new LogsCtrl();

rotaLogs.post('/', logsCtrl.gravar)  
        .get('/', logsCtrl.consultar);  

export default rotaLogs;
