import { z } from "zod";

const ExternalUrlsSchema = z.object({
  spotify: z.string(),
});

const FollowersSchema = z.object({
  href: z.string().nullable(),
  total: z.number(),
});

const ImageSchema = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
});

// Track schema is a simplified version. You can extend it with more properties if needed.
const TrackSchema = z.object({
  album: z.unknown(), // Simplified, you can use the AlbumSchema from previous examples if needed.
  artists: z.unknown(), // Simplified, you can use the ArtistSchema from previous examples if needed.
  available_markets: z.array(z.string()),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_ids: z.unknown(), // Simplified, you can create a schema for external_ids if needed.
  external_urls: ExternalUrlsSchema,
  href: z.string(),
  id: z.string(),
  is_playable: z.boolean().optional(),
  linked_from: z.unknown().optional(), // Simplified, you can create a schema for linked_from if needed.
  name: z.string(),
  popularity: z.number(),
  preview_url: z.string().nullable(),
  track_number: z.number(),
  type: z.string(),
  uri: z.string(),
  is_local: z.boolean(),
});

const AddedBySchema = z.object({
  external_urls: ExternalUrlsSchema,
  href: z.string(),
  id: z.string(),
  type: z.string(),
  uri: z.string(),
});

const TrackItemSchema = z.object({
  added_at: z.string(),
  added_by: AddedBySchema,
  is_local: z.boolean(),
  track: TrackSchema,
});

const TracksSchema = z.object({
  href: z.string(),
  items: z.array(TrackItemSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});

const PlaylistOwnerSchema = z.object({
  external_urls: ExternalUrlsSchema,
  //   followers: FollowersSchema,
  href: z.string(),
  id: z.string(),
  type: z.string(),
  uri: z.string(),
  display_name: z.string(),
});

export const PlaylistFullSchema = z.object({
  collaborative: z.boolean(),
  description: z.string(),
  external_urls: ExternalUrlsSchema,
  followers: FollowersSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  owner: PlaylistOwnerSchema,
  public: z.boolean(),
  snapshot_id: z.string(),
  tracks: TracksSchema,
  type: z.string(),
  uri: z.string(),
});

const PlaylistPartialSchema = z.object({
  collaborative: z.boolean(),
  description: z.string(),
  external_urls: ExternalUrlsSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  owner: PlaylistOwnerSchema,
  public: z.boolean(),
  snapshot_id: z.string(),
  tracks: z.object({
    href: z.string(),
    total: z.number(),
  }),
  type: z.string(),
  uri: z.string(),
});

export const CurrentUsersPlaylistsResponseSchema = z.object({
  href: z.string(),
  items: z.array(PlaylistPartialSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});
