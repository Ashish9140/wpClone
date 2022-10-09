import ChatBox from "./pages/ChatBox";
import { CartContext } from "./CartContext";
import { useState } from "react";
import Loading from './components/Loading'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

function App() {

  const [showChat, setShowChat] = useState(false);
  const [room, setRoom] = useState('');
  const [rightTop, setRightTop] = useState({
    name: 'room Name',
    avatar: '/images/ppp3.jpg'
  });
  const [messageList, setMessageList] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  return (
    <CartContext.Provider value={{ showChat, setShowChat, messageList, setMessageList, allRooms, setAllRooms, setRoom, room, user, setUser, rightTop, setRightTop }}>
      {
        loading ? <Loading setLoading={setLoading} /> :
          <Router>
            <Switch>

              <Route exact path="/">
                {user ? <Redirect to="/message-area" /> : <AuthPage />}
              </Route>
              <Route exact path="/message-area">
                {!user ? <Redirect to="/" /> : <ChatBox />}
              </Route>

            </Switch>
          </Router>

      }
    </CartContext.Provider >
  )
}

export default App;
