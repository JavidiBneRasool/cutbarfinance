import { ReactComponent as GPay }      from '../assets/icons/gpay.svg';
import { ReactComponent as Paytm }     from '../assets/icons/paytm.svg';
import { ReactComponent as PhonePe }   from '../assets/icons/phonepe.svg';
import { ReactComponent as Visa }      from '../assets/icons/visa.svg';
import { ReactComponent as AmazonPay } from '../assets/icons/amazonpay.svg';

export const UPI_SVGS = {
  gpay:      <GPay width={90} height={36}/>,
  phonepe:   <PhonePe width={100} height={34}/>,
  paytm:     <Paytm width={100} height={36}/>,
  amazonpay: <AmazonPay width={96} height={30}/>,
  visa:      <Visa width={72} height={28}/>,

  upi: (
    <svg viewBox="0 0 80 30" width="70" height="28">
      <rect width="80" height="30" rx="6" fill="#097939"/>
      <text x="8" y="22" fontFamily="Arial" fontWeight="900" fontSize="20" fill="white" letterSpacing="2">UPI</text>
      <rect x="60" y="6" width="4" height="18" rx="2" fill="#FF6B00"/>
      <rect x="68" y="6" width="4" height="18" rx="2" fill="#FF6B00"/>
    </svg>
  ),
  master: (
    <svg viewBox="0 0 58 36" width="52" height="32">
      <circle cx="20" cy="18" r="15" fill="#EB001B"/>
      <circle cx="38" cy="18" r="15" fill="#F79E1B"/>
      <path d="M29 6.8a15 15 0 0 1 0 22.4 15 15 0 0 1 0-22.4z" fill="#FF5F00"/>
    </svg>
  ),
  rupay: (
    <svg viewBox="0 0 90 28" width="84" height="26">
      <rect width="90" height="28" rx="6" fill="#214FA7"/>
      <text x="8" y="20" fontFamily="Arial" fontWeight="900" fontSize="15" fill="white">Ru</text>
      <text x="30" y="20" fontFamily="Arial" fontWeight="900" fontSize="15" fill="#F7941D">Pay</text>
      <rect x="60" y="5" width="25" height="18" rx="4" fill="white" opacity=".08"/>
      <text x="63" y="17" fontFamily="Arial" fontWeight="700" fontSize="8" fill="white" letterSpacing=".5">NPCI</text>
    </svg>
  ),
  digirupee: (
    <svg viewBox="0 0 90 28" width="84" height="26">
      <rect width="90" height="28" rx="6" fill="#138808"/>
      <text x="8" y="20" fontFamily="Arial" fontWeight="900" fontSize="14" fill="white">e</text>
      <text x="20" y="21" fontFamily="Arial" fontWeight="900" fontSize="17" fill="#FF9933">₹</text>
      <text x="36" y="19" fontFamily="Arial" fontWeight="700" fontSize="11" fill="white" letterSpacing=".8">Rupee</text>
      <text x="8" y="27" fontFamily="Arial" fontWeight="400" fontSize="6" fill="rgba(255,255,255,.6)" letterSpacing=".5">RBI · CBDC</text>
    </svg>
  ),
  netbank: (
    <svg viewBox="0 0 36 36" width="32" height="32">
      <rect width="36" height="36" rx="8" fill="#00558B"/>
      <polygon points="18,4 32,12 32,14 4,14 4,12" fill="white"/>
      <rect x="7"  y="16" width="4" height="12" rx="1" fill="white"/>
      <rect x="16" y="16" width="4" height="12" rx="1" fill="white"/>
      <rect x="25" y="16" width="4" height="12" rx="1" fill="white"/>
      <rect x="4"  y="29" width="28" height="3" rx="1" fill="white"/>
    </svg>
  ),
};

export const COUNTRIES = [
  {name:'India',        code:'IN', dial:'+91',  digits:10, flag:'🇮🇳'},
  {name:'Pakistan',     code:'PK', dial:'+92',  digits:10, flag:'🇵🇰'},
  {name:'Bangladesh',   code:'BD', dial:'+880', digits:10, flag:'🇧🇩'},
  {name:'UAE',          code:'AE', dial:'+971', digits:9,  flag:'🇦🇪'},
  {name:'Saudi Arabia', code:'SA', dial:'+966', digits:9,  flag:'🇸🇦'},
  {name:'USA',          code:'US', dial:'+1',   digits:10, flag:'🇺🇸'},
  {name:'UK',           code:'GB', dial:'+44',  digits:10, flag:'🇬🇧'},
  {name:'Singapore',    code:'SG', dial:'+65',  digits:8,  flag:'🇸🇬'},
  {name:'Nepal',        code:'NP', dial:'+977', digits:10, flag:'🇳🇵'},
  {name:'Malaysia',     code:'MY', dial:'+60',  digits:10, flag:'🇲🇾'},
];
