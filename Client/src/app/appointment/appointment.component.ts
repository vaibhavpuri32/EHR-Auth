import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from 'src/services/blockchain.service';
import { specialities } from '../../utils/Doctor_Specialities';
import * as moment from 'moment';
export default moment;

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.sass'],
})
export class AppointmentComponent implements OnInit {

  now = new Date();
  days=30;
  year = this.now.getFullYear();
  month = this.now.getMonth();
  day = this.now.getDay();
  minDate = moment(new Date()).format('YYYY-MM-DD');
  diff:any;
  


  constructor(
    private blockchainServices: BlockchainService,
    private router: Router
  ) {}

  // today = Date.now();

  Specialities = specialities;
  
  showProgress = true;
  progressWarn = false;
  progressMsg = 'Checking is Patient';
  progressSuccess = false
  buttonTxt = '';

  model:any ={

  }

  patientID = ''
  DoctorsList:any

  warn: boolean = false;

  ngOnInit(): void {    
  
    this.checkisPatient();

    this.blockchainServices.getDoctors().subscribe((result:any)=>{
      console.log(result.data);
      let data = JSON.stringify(result.data)
      this.DoctorsList = JSON.parse(data)
    })
  }

  // addDays(days : number): Date{
  //   var futureDate = new Date();
  //   console.log("adadsfsf" + futureDate.getDate());
  //   futureDate.setDate(futureDate.getDate() + days);
  //   console.log("adadsfsf"+futureDate);
  //   return futureDate;
  // }
  
  checkisPatient() {
    this.blockchainServices
      .checkIsPatient()
      .then((r: any) => {
        console.log(r);
        this.model.patID = this.blockchainServices.account
        this.showProgress = false
      })
      .catch((err: any) => {
        console.log(err);
        this.progressWarn = true;
        this.progressMsg = 'Only Patient can book appointments <br> if you are not registerd please Register';
        this.buttonTxt = 'Register';
      });
  }

  onRegister() {
    this.router.navigate(['register']);
  }

  addAppointment(){
    this.showProgress = true
    this.progressMsg = 'Adding Appointment'
    let data = new FormData()

    var date1=this.minDate;

    var date2=this.model.date;
    
    console.log("diff ye h"+date1);

    console.log("diff ye h"+date2);
    
    this.diff =  Math.floor(( Date.parse(date2) - Date.parse(date1) ) / 86400000);
    console.log("diff ye h"+this.diff);
 
    if(this.diff<30)
    {
      data.append("docID",this.model.docID)
      data.append("patID",this.model.patID)
      data.append("department",this.model.department)
      data.append("date",this.model.date)
      data.append("time",this.model.time)

      this.blockchainServices.addAppointment(data).then((r:any)=>{
        console.log(r);
        if(r.status ="succcess"){
          this.progressMsg = 'Appointment Added successfull'
          this.progressSuccess = true
          this.model = {}
        }
      })
      
    }
    else{
      this.progressMsg = 'Add Appointment withing 30 days from today only'
    }
  }
  close(){
    if(this.diff<30)
      this.showProgress = false
    else
      this.warn = true;
  }

  
}