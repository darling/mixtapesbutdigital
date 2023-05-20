import { useAuth } from "@clerk/nextjs";
import { FC, createContext, useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";

export type SpotifyContextProps = {
  accessToken?: string;
  setAccessToken: (token?: string) => void;
  deviceId?: string;
  setDeviceId: (deviceId?: string) => void;
  player?: Spotify.Player;
  setPlayer: (player?: Spotify.Player) => void;
  playerState?: Spotify.PlaybackState | null;
  setPlayerState: (state: Spotify.PlaybackState | null) => void;
  //   misc
  lastPlayedMixtapeId?: string;
};

export const SpotifyContext = createContext<SpotifyContextProps>({
  setAccessToken: () => null,
  setDeviceId: () => null,
  setPlayer: () => null,
  setPlayerState: () => null,
});

interface SpotifyProviderProps {
  children: React.ReactNode;
}

export const SpotifyProvider: FC<SpotifyProviderProps> = ({ children }) => {
  const tokenFetchResolver = api.spotify.getToken.useQuery();

  const [accessToken, setAccessToken] = useState<string>();
  const [deviceId, setDeviceId] = useState<string>();
  const [player, setPlayer] = useState<Spotify.Player>();
  const [playerState, setPlayerState] = useState<Spotify.PlaybackState | null>(
    null
  );
  const [lastPlayedMixtapeId, setLastPlayedMixtapeId] = useState<string>();

  useEffect(() => {
    if (!tokenFetchResolver.data) return;

    // if the script is already loaded, don't load it again
    if (window.Spotify) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("SPOTIFY WEB PLAYBACK SDK READY");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const newPlayer: Spotify.Player = new window.Spotify.Player({
        name: "Mixtapes But Digital",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        getOAuthToken: (cb) => cb(tokenFetchResolver.data),
        volume: 0.5,
      });

      newPlayer.connect().catch((err) => console.error(err));

      newPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
      });

      newPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setDeviceId(undefined);
      });

      newPlayer.addListener("player_state_changed", (state) => {
        console.log("PLAYER STATE CHANGE", state);
        setPlayerState(state ?? null);
      });

      newPlayer.addListener("initialization_error", ({ message }) => {
        console.error("PLAYER INIT ERROR", message);
      });

      newPlayer.addListener("authentication_error", ({ message }) => {
        console.error("PLAYER AUTH ERROR", message);
      });

      newPlayer.addListener("account_error", ({ message }) => {
        console.error("PLAYER ACCOUNT ERROR", message);
      });

      newPlayer.addListener("playback_error", ({ message }) => {
        console.error("PLAYER PLAYBACK ERROR", message);
      });

      setPlayer(newPlayer);
    };

    return () => {
      document.body.removeChild(script);
      // TODO: Find a way to remove and destroy the player
    };
  }, [tokenFetchResolver.data]);

  return (
    <SpotifyContext.Provider
      value={{
        accessToken,
        setAccessToken,
        deviceId,
        setDeviceId,
        player,
        setPlayer,
        playerState,
        setPlayerState,
        lastPlayedMixtapeId,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const playMixtapeResolver = api.spotify.playTracks.useMutation();
  const context = useContext(SpotifyContext);

  if (!context) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }

  const { deviceId, player, playerState, lastPlayedMixtapeId } = context;

  const playMixtape = (mixtapeId: string) => {
    if (player) {
      player.activateElement().catch((err) => console.error(err));
    }

    playMixtapeResolver.mutate({
      mixtapeId,
      device_id: deviceId,
    });
  };

  return {
    playMixtape,
    isPlaying: playerState?.paused === false,
    isActiveDevice: playerState?.playback_id !== "" && playerState,
    controls: {
      togglePlay: () => {
        player?.togglePlay().catch((err) => console.error(err));
      },
      nextTrack: () => {
        player?.nextTrack().catch((err) => console.error(err));
      },
      previousTrack: () => {
        player?.previousTrack().catch((err) => console.error(err));
      },
    },
    player: {
      currentTrack: playerState?.track_window.current_track,
    },
    lastPlayedMixtapeId,
  };
};
