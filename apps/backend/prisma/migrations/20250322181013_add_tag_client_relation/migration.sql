-- CreateTable
CREATE TABLE "_TagToClient" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TagToClient_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TagToClient_B_index" ON "_TagToClient"("B");

-- AddForeignKey
ALTER TABLE "_TagToClient" ADD CONSTRAINT "_TagToClient_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToClient" ADD CONSTRAINT "_TagToClient_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
