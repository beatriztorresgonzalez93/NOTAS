"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Input,
  InputField,
  ScrollView,
  Text,
  VStack,
  Divider,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/themed";
import type { GradeEntry, Subject } from "@/types/subject";
import { averageGrade } from "@/lib/grades";

function GradeList({
  title,
  items,
  onRemove,
}: {
  title: string;
  items: GradeEntry[];
  onRemove: (index: number) => void;
}) {
  if (items.length === 0) {
    return (
      <Text size="sm" color="$textLight500">
        Sin {title.toLowerCase()} registrados
      </Text>
    );
  }

  return (
    <VStack space="xs">
      {items.map((item, index) => (
        <HStack
          key={item._id ?? `${item.name}-${index}`}
          justifyContent="space-between"
          alignItems="center"
          py="$1"
        >
          <Text flex={1} size="sm">
            {item.name}
          </Text>
          <Text size="sm" fontWeight="$semibold" mx="$3">
            {item.score}
          </Text>
          <Button
            size="xs"
            variant="outline"
            action="negative"
            onPress={() => onRemove(index)}
          >
            <ButtonText>Quitar</ButtonText>
          </Button>
        </HStack>
      ))}
    </VStack>
  );
}

function SubjectCard({
  subject,
  onUpdate,
  onDelete,
}: {
  subject: Subject;
  onUpdate: (updated: Subject) => void;
  onDelete: (id: string) => void;
}) {
  const [workName, setWorkName] = useState("");
  const [workScore, setWorkScore] = useState("");
  const [examName, setExamName] = useState("");
  const [examScore, setExamScore] = useState("");
  const [finalOverride, setFinalOverride] = useState(
    subject.finalGrade !== null ? String(subject.finalGrade) : ""
  );
  const [saving, setSaving] = useState(false);

  const calculated = averageGrade(subject.assignments, subject.exams);
  const displayedFinal =
    subject.finalGrade !== null ? subject.finalGrade : calculated;

  const persist = useCallback(
    async (patch: Partial<Subject>) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/subjects/${subject._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error("Error al guardar");
        const updated = (await res.json()) as Subject;
        onUpdate(updated);
      } finally {
        setSaving(false);
      }
    },
    [subject._id, onUpdate]
  );

  const parseScore = (value: string) => {
    const n = parseFloat(value.replace(",", "."));
    if (Number.isNaN(n) || n < 0 || n > 10) return null;
    return Math.round(n * 100) / 100;
  };

  const addEntry = async (
    field: "assignments" | "exams",
    name: string,
    scoreStr: string,
    clear: () => void
  ) => {
    const score = parseScore(scoreStr);
    if (!name.trim() || score === null) return;

    const entry: GradeEntry = { name: name.trim(), score };
    const list = [...subject[field], entry];
    await persist({ [field]: list });
    clear();
  };

  const removeEntry = async (field: "assignments" | "exams", index: number) => {
    const list = subject[field].filter((_, i) => i !== index);
    await persist({ [field]: list });
  };

  const saveFinalOverride = async () => {
    if (finalOverride.trim() === "") {
      await persist({ finalGrade: null });
      return;
    }
    const score = parseScore(finalOverride);
    if (score === null) return;
    await persist({ finalGrade: score });
  };

  return (
    <Box
      borderWidth={1}
      borderColor="$borderLight300"
      borderRadius="$lg"
      p="$4"
      bg="$backgroundLight0"
    >
      <HStack justifyContent="space-between" alignItems="center" mb="$3">
        <Heading size="md">{subject.name}</Heading>
        <Button
          size="sm"
          variant="outline"
          action="negative"
          onPress={() => onDelete(subject._id)}
          isDisabled={saving}
        >
          <ButtonText>Eliminar</ButtonText>
        </Button>
      </HStack>

      <VStack space="md">
        <Box>
          <Text fontWeight="$semibold" mb="$2">
            Trabajos
          </Text>
          <GradeList
            title="trabajos"
            items={subject.assignments}
            onRemove={(i) => removeEntry("assignments", i)}
          />
          <HStack space="sm" mt="$2" flexWrap="wrap">
            <Input flex={1} minWidth={120}>
              <InputField
                placeholder="Nombre del trabajo"
                value={workName}
                onChangeText={setWorkName}
              />
            </Input>
            <Input w={80}>
              <InputField
                placeholder="0-10"
                value={workScore}
                onChangeText={setWorkScore}
                keyboardType="decimal-pad"
              />
            </Input>
            <Button
              size="sm"
              onPress={() =>
                addEntry("assignments", workName, workScore, () => {
                  setWorkName("");
                  setWorkScore("");
                })
              }
              isDisabled={saving}
            >
              <ButtonText>Añadir</ButtonText>
            </Button>
          </HStack>
        </Box>

        <Divider />

        <Box>
          <Text fontWeight="$semibold" mb="$2">
            Exámenes
          </Text>
          <GradeList
            title="exámenes"
            items={subject.exams}
            onRemove={(i) => removeEntry("exams", i)}
          />
          <HStack space="sm" mt="$2" flexWrap="wrap">
            <Input flex={1} minWidth={120}>
              <InputField
                placeholder="Nombre del examen"
                value={examName}
                onChangeText={setExamName}
              />
            </Input>
            <Input w={80}>
              <InputField
                placeholder="0-10"
                value={examScore}
                onChangeText={setExamScore}
                keyboardType="decimal-pad"
              />
            </Input>
            <Button
              size="sm"
              onPress={() =>
                addEntry("exams", examName, examScore, () => {
                  setExamName("");
                  setExamScore("");
                })
              }
              isDisabled={saving}
            >
              <ButtonText>Añadir</ButtonText>
            </Button>
          </HStack>
        </Box>

        <Divider />

        <Box>
          <Text fontWeight="$semibold" mb="$1">
            Nota final
          </Text>
          <Text size="sm" color="$textLight600" mb="$2">
            Media automática:{" "}
            {calculated !== null ? calculated : "—"} · Mostrada:{" "}
            {displayedFinal !== null ? displayedFinal : "—"}
          </Text>
          <HStack space="sm" alignItems="center">
            <Input flex={1}>
              <InputField
                placeholder="Manual (vacío = usar media)"
                value={finalOverride}
                onChangeText={setFinalOverride}
                keyboardType="decimal-pad"
              />
            </Input>
            <Button size="sm" onPress={saveFinalOverride} isDisabled={saving}>
              <ButtonText>Guardar</ButtonText>
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default function NotasApp() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subjects");
      if (!res.ok) throw new Error();
      setSubjects(await res.json());
    } catch {
      setError(
        "No se pudo conectar con la base de datos. Revisa MONGODB_URI en .env.local."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const addSubject = async () => {
    const name = newName.trim();
    if (!name) return;

    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      setError("No se pudo crear la asignatura");
      return;
    }

    const created = (await res.json()) as Subject;
    setSubjects((prev) => [created, ...prev]);
    setNewName("");
  };

  const deleteSubject = async (id: string) => {
    const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setSubjects((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <Box flex={1} bg="$backgroundLight50" py="$8" px="$4">
      <Box maxWidth={720} width="100%" alignSelf="center">
        <Heading size="2xl" mb="$2">
          Registro de notas
        </Heading>
        <Text color="$textLight600" mb="$6">
          Trabajos, exámenes y nota final por asignatura (escala 0–10).
        </Text>

        <FormControl mb="$6">
          <FormControlLabel>
            <FormControlLabelText>Nueva asignatura</FormControlLabelText>
          </FormControlLabel>
          <HStack space="md">
            <Input flex={1}>
              <InputField
                placeholder="Ej. Matemáticas"
                value={newName}
                onChangeText={setNewName}
              />
            </Input>
            <Button onPress={addSubject}>
              <ButtonText>Añadir</ButtonText>
            </Button>
          </HStack>
        </FormControl>

        {error && (
          <Box bg="$error100" p="$3" borderRadius="$md" mb="$4">
            <Text color="$error700">{error}</Text>
          </Box>
        )}

        {loading ? (
          <Text>Cargando…</Text>
        ) : subjects.length === 0 ? (
          <Text color="$textLight500">
            Aún no hay asignaturas. Añade la primera arriba.
          </Text>
        ) : (
          <ScrollView>
            <VStack space="lg" pb="$8">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject._id}
                  subject={subject}
                  onUpdate={(updated) =>
                    setSubjects((prev) =>
                      prev.map((s) => (s._id === updated._id ? updated : s))
                    )
                  }
                  onDelete={deleteSubject}
                />
              ))}
            </VStack>
          </ScrollView>
        )}
      </Box>
    </Box>
  );
}
