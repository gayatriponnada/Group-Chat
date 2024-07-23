import { useState } from "react";
import { cloneDeep } from "lodash";

const usePlayer = (peerId) => {
  const [players, setPlayers] = useState([]);
  const playersClone = cloneDeep(players);
  const highlightedPlayers = playersClone[peerId];
  delete playersClone[peerId];
  const nonHighlightedPlayers = playersClone;

  return { players, setPlayers, highlightedPlayers, nonHighlightedPlayers };
};

export default usePlayer;
