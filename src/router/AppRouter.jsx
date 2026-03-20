import HomePage            from '../pages/HomePage';
import MarketPage          from '../pages/MarketPage';
import TradePage           from '../pages/TradePage';
import UpDownPage          from '../pages/UpDownPage';
import EarnPage            from '../pages/EarnPage';
import FunPage             from '../pages/FunPage';
import NewsPage            from '../pages/NewsPage';
import ChatPage            from '../pages/ChatPage';
import AboutPage           from '../pages/AboutPage';
import TokenPage           from '../pages/TokenPage';
import SupportPage         from '../pages/SupportPage';
import SettingsPage        from '../pages/SettingsPage';
import TournamentsPage     from '../pages/TournamentsPage';
import StakeTournamentPage from '../pages/StakeTournamentPage';
import ComingSoonPage      from '../pages/ComingSoonPage';
import BankPage            from '../pages/BankPage';
import WalletPage          from '../pages/WalletPage';
import AccountPage         from '../pages/AccountPage';
import CutPayPage          from '../pages/CutPayPage';
import CutbarUpiPage       from '../pages/CutbarUpiPage';
import CutFinancePage      from '../pages/CutFinancePage';
import { CutPlayPage, LastStandingPage } from '../pages/CutPlayPage';

export default function AppRouter({
  page, navigate, goBack, toast,
  coins, bp, load, ts, go, trend, global, fg,
  posts, nLoad,
  theme, setTheme,
  userProfile, setUserProfile,
}) {
  switch (page) {
    // ── Core ──
    case 'home':             return <HomePage    navigate={navigate} coins={coins} bp={bp} global={global} fg={fg} load={load}/>;
    case 'market':           return <MarketPage  coins={coins} bp={bp} load={load} ts={ts} go={go} trend={trend} onBack={goBack}/>;
    case 'trade':
    case 'swap':             return <TradePage   toast={toast} coins={coins} bp={bp} onBack={goBack}/>;
    case 'updown':           return <UpDownPage  toast={toast} bp={bp} onBack={goBack}/>;
    case 'earn':             return <EarnPage    toast={toast} onBack={goBack} coins={coins}/>;
    case 'fun':              return <FunPage     navigate={navigate} toast={toast} onBack={goBack}/>;
    case 'news':             return <NewsPage    posts={posts} load={nLoad} onBack={goBack}/>;
    case 'chat':             return <ChatPage    onBack={goBack}/>;
    case 'about':            return <AboutPage   toast={toast} onBack={goBack}/>;
    case 'token':            return <TokenPage   toast={toast} onBack={goBack}/>;
    case 'support':          return <SupportPage toast={toast} onBack={goBack}/>;
    case 'settings':         return <SettingsPage theme={theme} setTheme={setTheme} toast={toast} onBack={goBack}/>;

    // ── Phase 3: Mini pages ──
    case 'tournaments':      return <TournamentsPage     toast={toast} onBack={goBack}/>;
    case 'stake_tournament': return <StakeTournamentPage toast={toast} onBack={goBack}/>;

    // ── Phase 4: Finance ──
    case 'bank':             return <BankPage    toast={toast} onBack={goBack} navigate={navigate}/>;
    case 'cutpay':           return <CutPayPage  toast={toast} onBack={goBack}/>;
    case 'cutbarupi':        return <CutbarUpiPage toast={toast} onBack={goBack}/>;
    case 'wallet':
    case 'receive':
    case 'send':
    case 'p2p':              return <WalletPage  toast={toast} coins={coins} bp={bp} onBack={goBack} navigate={navigate}/>;
    case 'account':          return <AccountPage toast={toast} onBack={goBack} theme={theme} setTheme={setTheme} userProfile={userProfile} setUserProfile={setUserProfile}/>;
    case 'finance':          return <CutFinancePage toast={toast} onBack={goBack} navigate={navigate}/>;

    // ── Phase 5: Games ──
    case 'cutplay':          return <CutPlayPage     toast={toast} onBack={goBack}/>;
    case 'laststand':        return <LastStandingPage toast={toast} onBack={goBack}/>;

    default:                 return <HomePage navigate={navigate} coins={coins} bp={bp} global={global} fg={fg} load={load}/>;
  }
}
