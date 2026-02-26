import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@webnest.local";
  const adminPassword = "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "WebNest Admin",
      passwordHash,
      role: "ADMIN"
    },
    create: {
      name: "WebNest Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN"
    }
  });

  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    await prisma.lead.createMany({
      data: [
        {
          name: "Avery Reed",
          email: "avery@client.com",
          company: "Reed Logistics",
          phone: "555-0101",
          source: "REFERRAL",
          status: "NEW",
          message: "Looking to revamp our logistics dashboard."
        },
        {
          name: "Jamie Patel",
          email: "jamie@studio.com",
          company: "Patel Studio",
          source: "WEBSITE",
          status: "CONTACTED",
          message: "Need a redesign for our agency site."
        }
      ]
    });
  }

  const quoteCount = await prisma.quote.count();
  if (quoteCount === 0) {
    await prisma.quote.createMany({
      data: [
        {
          name: "Morgan Lee",
          email: "morgan@startup.io",
          company: "Launchpad",
          budgetRange: "$25k-$50k",
          timeline: "8-10 weeks",
          service: "DEV",
          details: "Build a scalable customer portal.",
          status: "NEW"
        },
        {
          name: "Riley Chen",
          email: "riley@secureco.com",
          company: "SecureCo",
          budgetRange: "$10k-$20k",
          timeline: "4-6 weeks",
          service: "SECURITY",
          details: "Security hardening and audit.",
          status: "SENT"
        }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
