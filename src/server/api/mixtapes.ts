import { prisma } from "../db";

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
};
