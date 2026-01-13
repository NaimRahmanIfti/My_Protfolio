import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    category: "Frontend Development",
    skills: [
      { name: "HTML", level: 87, color: "from-orange-400 via-orange-500 to-amber-500" },
      { name: "CSS", level: 85, color: "from-cyan-400 via-teal-500 to-cyan-600" },
      { name: "JavaScript", level: 60, color: "from-yellow-400 via-amber-500 to-orange-500" },
      { name: "React", level: 30, color: "from-cyan-400 via-blue-500 to-cyan-600" },
      { name: "Tailwind CSS", level: 65, color: "from-teal-400 via-cyan-500 to-teal-600" },
      { name: "Bootstrap", level: 70, color: "from-purple-400 via-fuchsia-500 to-purple-600" },
    ],
  },
  {
    category: "Backend Development",
    skills: [
      { name: "Python", level: 95, color: "from-blue-400 via-indigo-500 to-blue-600" },
      { name: "FastAPI", level: 80, color: "from-green-400 via-emerald-500 to-teal-600" },
      { name: "Flask", level: 80, color: "from-orange-400 via-amber-500 to-orange-600" },
      { name: "Node.js", level: 20, color: "from-green-400 via-emerald-500 to-green-600" },
      { name: "MongoDB", level: 75, color: "from-emerald-400 via-teal-500 to-emerald-600" },
    ],
  },
  {
    category: "Tools & Others",
    skills: [
      { name: "Git", level: 85, color: "from-red-400 via-rose-500 to-red-600" },
      { name: "Linux", level: 75, color: "from-green-400 via-lime-500 to-green-600" },
      { name: "Flutter", level: 50, color: "from-sky-400 via-blue-500 to-cyan-600" },
    ],
  },
];

const FloatingParticle = ({ delay }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-cyan-400/30 rounded-full blur-sm"
      initial={{ y: 0, x: 0, opacity: 0 }}
      animate={{
        y: [-20, -100],
        x: [0, Math.random() * 100 - 50],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  );
};

const SkillBar = ({ skill, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative mb-6 group"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="flex justify-between mb-3">
        <span className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">
          {skill.name}
        </span>
        <motion.span
          className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 + 0.3 }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="relative w-full h-3 overflow-hidden rounded-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative overflow-hidden shadow-lg`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            duration: 1.5,
            delay: index * 0.05,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={isInView ? { x: "200%" } : { x: "-100%" }}
            transition={{
              duration: 1.5,
              delay: index * 0.05 + 0.5,
              ease: "easeInOut",
            }}
          />
          {/* Glow effect */}
          <div className="absolute inset-0 blur-sm opacity-50 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Skills() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  let skillIndex = 0;

  return (
    <section ref={containerRef} className="relative py-20 overflow-hidden c-space">
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.2} />
      ))}

      {/* Background orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -left-48 top-20"
        style={{ y }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -right-48 bottom-20"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.h2
            className="text-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            My Skills
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-white/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Technologies and tools I work with
          </motion.p>
        </motion.div>

        <div className="space-y-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: catIndex * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-md border border-white/10 hover:border-orange-500/30 transition-all duration-500 group overflow-hidden"
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-cyan-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-cyan-500/5 group-hover:to-orange-500/5 transition-all duration-500 rounded-2xl" />
              
              <h3 className="relative z-10 mb-8 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/80">
                {category.category}
              </h3>
              <div className="relative z-10 grid gap-6 md:grid-cols-2">
                {category.skills.map((skill) => {
                  const currentIndex = skillIndex++;
                  return (
                    <SkillBar
                      key={skill.name}
                      skill={skill}
                      index={currentIndex}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}