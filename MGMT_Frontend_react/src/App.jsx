// App.jsx
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import HomeScreen from './Pages/HomeScreen/HomePage';
import DefaulterListProp from './Pages/Property/DefaulterListProp/DefaulterListProp';
import TaxCollection from "./Pages/Property/TaxCollectionDemand/TaxCollection";
import TCDPrabhag from "./Pages/Property/TaxCollectionDemand/TCDPrabhag";
import TCDWard from "./Pages/Property/TaxCollectionDemand/TCDWard";
import TaxCollectionWardWise from './Pages/Property/WardwiseTaxCollection/TaxCollectionWardWise';
import PropertyDashboard from './Pages/Dashboard/PropertyDashboard';
import Daindin from './Pages/Property/Daily/Daindin';
import ResidentCommerical from './Pages/Property/ResidentCommercial/ResidentCommercial';
import Tax from "./Pages/Property/Tax/Tax";
import WardwiseDailyCollection from "./Pages/Property/WardwiseDailyCollection/WardwiseDailyCollection";
import Recovery from "./Pages/Property/Recovery/Recovery";
import Login from './HOC/Login/Login';
import LegalIllegal from './Pages/Property/LegalIllegal/LegalIllegal';
import ResidentCommericalPrabhag from './Pages/Property/ResidentCommercial/ResidentCommercialPrabhag';
import TaxCollectionbyprabhag from './Pages/Property/WardwiseTaxCollection/TaxCollectionbyprabhag';
import TaxCollectionWardWiseinBlock from './Pages/Property/WardwiseTaxCollection/TaxCollectionWardWiseinBlock';
import LegalBlock from './Pages/Property/LegalIllegal/LegalBlock';
import LegalPrabhag from './Pages/Property/LegalIllegal/LegalPrabhag';
import ResidentCommericalBlock from './Pages/Property/ResidentCommercial/ResidentCommercialBlock';
import DivisionWisePrecentRpt from './Pages/Property/DivisionWisePrecentRpt/DivisionWisePrecentRpt';
import DivisionWisePrctPrabhag from './Pages/Property/DivisionWisePrecentRpt/DivisionWisePrctPrabhag';
import DivisionWisePrctBlock from './Pages/Property/DivisionWisePrecentRpt/DivisionWisePrctBlock';

import DailyTaxCollection from './Pages/Water/DailyTaxCollection/DailyTaxCollection';
import WardWiseTaxDemand from './Pages/Water/WardWiseTaxDemand/WardWiseTaxDemand';
import WardWiseTax from './Pages/Water/WardWiseTax/WardWiseTax';
import HitList from "./Pages/Water/HitList/HitList";
import WaterDashboard from './Pages/Dashboard/WaterDashboard';
import WardWiseTaxbywardid from './Pages/Water/WardWiseTax/WardWiseTaxbywardid';
import WardWiseTaxbyzoneid from './Pages/Water/WardWiseTax/WardWiseTaxbyzoneid';
import WarterWardWiseDailyCollection from "./Pages/Water/WardwiseDailyCollection/WardwiseDailyCollection";
import WaterLegalIllegal from "./Pages/Water/LegalIllegal/LegalIllegal";
import WaterLegalPrabhag from "./Pages/Water/LegalIllegal/LegalPrabhag";
import WaterLegalBlock from "./Pages/Water/LegalIllegal/LegalBlock";
import SingleRecovery from './Pages/Water/SingleRecovery/SingleRecovery';
import SingleRecoveryPrabhag from './Pages/Water/SingleRecovery/SingleRecoveryPrabhag';
import SingleRecoveryBlock from './Pages/Water/SingleRecovery/SingleRecoveryBlock';
import WaterResidentCommercial from './Pages/Water/WaterResidentCommercial/WaterResidentCommercial';

import CRMDashboard from './Pages/Dashboard/CRMDashboard';
import CrmDashBoardOut from './Pages/CRM/Dashboard/CrmDashboard';
import FeedbackSummary from './Pages/CRM/FeedbackSummary/FeedbackSummary';
import FeedbackSummarybyDate from './Pages/CRM/FeedbackSummary/FeedbackSummarybyDate';
import CRMInfoDashboard from './Pages/Dashboard/CRMInfoDashboard';
import CRMMainDashboard from './Pages/Dashboard/CRMMainDashboard';
import MahitiSodha from './Pages/CRM/SuggestionsResponses/MahitiSodha/MahitiSodha';
import ComplaintTypetwo from "./Pages/CRM/ComplaintTypetwo/ComplaintType";
import PendingReportOne from "./Pages/CRM/PendingReportOne/PendingReportOne";
import PendingReportTwo from "./Pages/CRM/PendingReportTwo/PendingReportTwo";
import DepartmentWiseComplaint from "./Pages/CRM/DepartmentWiseComplaint/DepartmentWiseComplaint";
import ComplaintTypes from "./Pages/CRM/ComplaintTypes/ComplaintTypes";
import ComplaintSummary from "./Pages/CRM/ComplaintSummary/ComplaintSummary";
import ComplaintSummary2 from "./Pages/Complaint/ComplaintSummary.jsx"
import FrontdoorLogin from './FrontdoorLogin.jsx';
import CADDashboard from './Pages/Dashboard/CADDashboard.jsx';
import Administrative from './Pages/Dashboard/Administrative.jsx';
import CFCDashboard from './Pages/Dashboard/CFCDashboard.jsx';
import ComplaintType from './Pages/Complaint/ComplaintType.jsx';
import ComplaintDepartmentWise from './Pages/Complaint/ComplaintDepartmentWise.jsx';
import Taxcollection from './Pages/CFC/Taxcollection/Taxcollection.jsx';
import WardWiseTaxColl from './Pages/CFC/WardWiseTaxColl/WardWiseTaxColl.jsx';
import TotalCollPercent from './Pages/CFC/TotalCollPercent/TotalCollPercent.jsx';
import ZoneWiseTaxColl from './Pages/CFC/ZoneWiseTaxColl/ZoneWiseTaxColl.jsx';
import TypeOfComplaint from './Pages/Complaint/TypeOfComplaint.jsx';
import ReportTimelyReflection from './Pages/Complaint/ReportTimelyReflection.jsx';
import Marriage from './Pages/Administrative/Marriage/Marriage.jsx';
import MiscellaneousInfo from './Pages/Administrative/Marriage/MiscellaneousInfo.jsx';
import WardWiseMrgRegistration from './Pages/Administrative/Marriage/WardWiseMrgRegistration.jsx';
import SearchInformation from './Pages/Administrative/Marriage/SearchInformation.jsx';
import IncomeOutgoing from './Pages/Administrative/IncomeOutgoing/IncomeOutgoing.jsx';
import MiscellaneousInformation from './Pages/Administrative/IncomeOutgoing/MiscellaneousInformation.jsx';
import OutwardInformation from './Pages/Administrative/IncomeOutgoing/OutwardInformation.jsx';
import BirthAndDeath from './Pages/Administrative/BirthAndDeath/BirthAndDeath.jsx';
import Birth from './Pages/Administrative/BirthAndDeath/Birth/Birth.jsx';
import Death from './Pages/Administrative/BirthAndDeath/Death/Death.jsx';
import BirthRegistrationByDate from './Pages/Administrative/BirthAndDeath/Birth/BirthRegistrationByDate.jsx';
import BirthRegistrationByWard from './Pages/Administrative/BirthAndDeath/Birth/BirthRegistrationByWard.jsx';
import BirthSearchInfo from './Pages/Administrative/BirthAndDeath/Birth/BirthSearchInfo.jsx';
import DeathRegistrationByDate from './Pages/Administrative/BirthAndDeath/Death/DeathRegistrationByDate.jsx';
import DeathRegistrationByWard from './Pages/Administrative/BirthAndDeath/Death/DeathRegistrationByWard.jsx';
import DeathSearchInfo from './Pages/Administrative/BirthAndDeath/Death/DeathSearchInfo.jsx';
import Fire from './Pages/Administrative/Fire/Fire.jsx';
import TypesOfComplaint from './Pages/Administrative/Fire/TypesOfComplaint.jsx';
import ComplaintType2 from './Pages/Administrative/Fire/ComplaintType2.jsx';
import ProtectedRoute from './HOC/ProtectedRoute.jsx';
import ComplaintReportByPeriod from './Pages/Complaint/ComplaintReportByPeriod.jsx';
import ComplaintGrvRpt from './Pages/Complaint/ComplaintGrvRpt.jsx';
import ReOpen from './Pages/Complaint/ReOpen.jsx';
import Market from './Pages/Market/Market.jsx';
import ApplicationDetails from './Pages/Market/ApplicationDetails.jsx';
import TrackApplication from './Pages/Market/TrackApplication.jsx';
import MarketAhwal from './Pages/Market/MarketAhwal.jsx';
import Estate from './Pages/Estate/Estate.jsx';
import ZoneWise from './Pages/Estate/ZoneWise.jsx';
import ZoneWiseMarket from './Pages/Estate/ZoneWiseMarket.jsx';
import Rts from './Pages/RTS/Rts.jsx';
import Department from './Pages/RTS/Department.jsx';
import ServiceWiseDetails from './Pages/RTS/ServiceWiseDetails.jsx';
import RtsTrackApplication from './Pages/RTS/RtsTrackApplication.jsx';
import Accounts from './Pages/Accounts/Accounts.jsx';
import ZonewiseReceiptDetails from './Pages/Accounts/ZonewiseReceiptDetails.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Front-door auto-login route */}
        <Route path="/welcome" element={<FrontdoorLogin />} />

        {/* Auth pages */}
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<ProtectedRoute>
          <Routes>
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/CrmDashBoardOut" element={<CrmDashBoardOut />} />
            <Route path="/CADDashboard" element={<CADDashboard />} />
            <Route path="/Administrative" element={<Administrative />} />
            <Route path="/CfcDashBoard" element={<CFCDashboard />} />

            {/* Dashboard */}
            <Route path="/propertydashboard" element={<PropertyDashboard />} />
            <Route path="/waterdashboard" element={<WaterDashboard />} />
            <Route path='/CRMMainDashboard' element={<CRMMainDashboard />} />
            <Route path='/informationandfeedback' element={<CRMInfoDashboard />} />
            <Route path='/cms' element={<CRMDashboard />} />

            {/* first tile */}
            {/* first tile */}
            <Route path="/dailycollection" element={<Daindin />} />

            {/* second tile */}
            <Route path="/TaxCollectionDemand" element={<TaxCollection />} />
            <Route path="/TCDPrabhag" element={<TCDPrabhag />} />
            <Route path="/TCDWard" element={<TCDWard />} />

            {/* third tile */}
            <Route path="/TaxCollectionWardWise" element={<TaxCollectionWardWise />} />
            <Route path="/TaxCollectionbyprabhag" element={<TaxCollectionbyprabhag />} />
            <Route path='/TaxCollectionWardWiseinBlock' element={<TaxCollectionWardWiseinBlock />} />

            {/* fourth tile */}
            <Route path="/DefaulterListProp" element={<DefaulterListProp />} />

            {/* fifth tile */}
            <Route path="/DivisionWisePrecentRpt" element={<DivisionWisePrecentRpt />} />
            <Route path="/DivisionWisePrctPrabhag" element={<DivisionWisePrctPrabhag />} />
            <Route path="/DivisionWisePrctBlock" element={<DivisionWisePrctBlock />} />

            {/* sixth tile */}
            <Route path="/collection_graph" element={<WardwiseDailyCollection />} />

            {/* seventh tile */}
            <Route path="/LegalIllegal" element={<LegalIllegal />} />
            <Route path="/LegalBlock" element={<LegalBlock />} />
            <Route path="/LegalPrabhag" element={<LegalPrabhag />} />

            {/* eighth tile */}
            <Route path="/ResidentCommerical" element={<ResidentCommerical />} />
            <Route path="/ward-details" element={<ResidentCommericalPrabhag />} />
            <Route path="/block-details" element={<ResidentCommericalBlock />} />

            {/* Water */}
            <Route path="/DailyTaxCollection" element={<DailyTaxCollection />} />
            <Route path="/WardWiseTaxDemand" element={<WardWiseTaxDemand />} />
            <Route path="/WardWiseTax" element={<WardWiseTax />} />
            <Route path="/wardwisetaxbywardid" element={<WardWiseTaxbywardid />} />
            <Route path="/Wardwisetaxbyzoneid" element={<WardWiseTaxbyzoneid />} />
            <Route path="/DefaulterListwater" element={<HitList />} />
            <Route path="/WaterWardWiseDailyCollection" element={<WarterWardWiseDailyCollection />} />
            <Route path="/WaterActiveInactive" element={<WaterLegalIllegal />} />
            <Route path="/WaterActivePrabhag" element={<WaterLegalPrabhag />} />
            <Route path="/WaterActiveBlock" element={<WaterLegalBlock />} />
            <Route path="/WaterResidentCommercial" element={<WaterResidentCommercial />} />
            <Route path='/SingleRecovery' element={<SingleRecovery />} />
            <Route path='/SingleRecoveryPrabhag' element={<SingleRecoveryPrabhag />} />
            <Route path='/SingleRecoveryBlock' element={<SingleRecoveryBlock />} />

            {/* CRM */}
            <Route path='/feedbacksummary' element={<FeedbackSummary />} />
            <Route path='/feedbacksummarybydate' element={<FeedbackSummarybyDate />} />
            <Route path='/ComplaintSummary' element={<ComplaintSummary />} />
            <Route path='/ComplaintTypes' element={<ComplaintTypes />} />
            <Route path='/DepartmentWiseComplaint' element={<DepartmentWiseComplaint />} />
            <Route path='/ComplaintTypetwo' element={<ComplaintTypetwo />} />
            <Route path='/PendingReportOne' element={<PendingReportOne />} />
            <Route path='/PendingReportTwo' element={<PendingReportTwo />} />
            <Route path='/MahitiSodha' element={<MahitiSodha />} />

            {/* Takrar */}
            <Route path='/ComplaintSummary2' element={<ComplaintSummary2 />} />
            <Route path='/ComplaintType' element={<ComplaintType />} />
            <Route path='/ComplaintDepartmentWise' element={<ComplaintDepartmentWise />} />
            <Route path='/TypeOfComplaint' element={<TypeOfComplaint />} />
            <Route path='/ReportTimelyReflection' element={<ReportTimelyReflection />} />
            <Route path='/ComplaintReportByPeriod' element={<ComplaintReportByPeriod />} />
            <Route path='/ComplaintGrvRpt' element={<ComplaintGrvRpt />} />
            <Route path='/ReOpen' element={<ReOpen />} />


            {/* Fallback so direct hits don’t 404 */}
            <Route path="*" element={<Navigate to="/welcome" replace />} />

            {/* CFC */}
            <Route path='/Taxcollection' element={<Taxcollection />} />
            <Route path="/WardWiseTaxColl" element={<WardWiseTaxColl />} />
            <Route path="/TotalCollPercent" element={<TotalCollPercent />} />
            <Route path="/ZoneWiseTaxColl" element={<ZoneWiseTaxColl />} />

            {/* Marriage */}
            <Route path="/Marriage" element={<Marriage />} />
            <Route path="/MiscellaneousInfo" element={<MiscellaneousInfo />} />
            <Route path="/WardWiseMrgRegistration" element={<WardWiseMrgRegistration />} />
            <Route path="/SearchInformation" element={<SearchInformation />} />

            {/* Birth & Death */}
            <Route path="/BirthAndDeath" element={<BirthAndDeath />} />
            <Route path="/Birth" element={<Birth />} />
            <Route path="/BirthRegistrationByDate" element={<BirthRegistrationByDate />} />
            <Route path="/BirthRegistrationByWard" element={<BirthRegistrationByWard />} />
            <Route path="/BirthSearchInfo" element={<BirthSearchInfo />} />
            <Route path="/Death" element={<Death />} />
            <Route path="/DeathRegistrationByDate" element={<DeathRegistrationByDate />} />
            <Route path="/DeathRegistrationByWard" element={<DeathRegistrationByWard />} />
            <Route path="/DeathSearchInfo" element={<DeathSearchInfo />} />

            {/* Administrative */}
            <Route path="/IncomeOutgoing" element={<IncomeOutgoing />} />
            <Route path="/MiscellaneousInformation" element={<MiscellaneousInformation />} />
            <Route path="/OutwardInformation" element={<OutwardInformation />} />
            <Route path="/Fire" element={<Fire />} />
            <Route path="/TypesOfComplaint" element={<TypesOfComplaint />} />
            <Route path="/ComplaintType2" element={<ComplaintType2 />} />

            {/* Market */}
            <Route path="/Market" element={<Market />} />
            <Route path="/ApplicationDetails" element={<ApplicationDetails />} />
            <Route path="/TrackApplication" element={<TrackApplication />} />
            <Route path="/MarketAhwal" element={<MarketAhwal />} />

            {/* Estate */}
            <Route path="/Estate" element={<Estate />} />
            <Route path="/ZoneWise" element={<ZoneWise />} />
            <Route path="/ZoneWiseMarket" element={<ZoneWiseMarket />} />

            {/* RTS */}
            <Route path="/Rts" element={<Rts />} />
            <Route path="/Department" element={<Department />} />
            <Route path="/ServiceWiseDetails" element={<ServiceWiseDetails />} />
            <Route path="/RtsTrackApplication" element={<RtsTrackApplication />} />




          </Routes>
        </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
