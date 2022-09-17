import PlayerMgr from "./playerMgr";
import WorshipMgr from "./worshipMgr";

declare global {
    var playerMgr: PlayerMgr;
    var worshipMgr: WorshipMgr;
}
