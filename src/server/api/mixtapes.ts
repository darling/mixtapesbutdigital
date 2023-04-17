import type { Mixtape, Song } from "@prisma/client";
import { prisma, redis } from "../db";

export const deleteMixtape = async (id: string) => {
  await prisma.song.deleteMany({
    where: {
      mixtapeId: id,
    },
  });

  await prisma.mixtape.delete({
    where: {
      id,
    },
  });

  await redis.del(`mixtape:${id}`);
  await redis.del(`mixtape:${id}:songs`);
};

export const getMixtape = async (id: string) => {
  const mixtape = await redis.get<
    Mixtape & {
      songs: Song[];
    }
  >(`mixtape:${id}`);

  if (mixtape) {
    return mixtape;
  }

  const mixtapeFromDb = await prisma.mixtape.findUnique({
    where: {
      id,
    },
    include: {
      songs: true,
    },
  });

  if (!mixtapeFromDb) {
    return null;
  }

  await redis.set(`mixtape:${id}`, mixtapeFromDb);

  return mixtapeFromDb;
};
