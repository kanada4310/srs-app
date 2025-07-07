import { Image as MantineImage, Button, Group, Text, FileInput } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { useState } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  previewUrl?: string | null;
}

export default function ImageUpload({ onImageSelect, previewUrl }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(previewUrl);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setLocalPreviewUrl(url);
      onImageSelect(selectedFile);
    } else {
      setLocalPreviewUrl(null);
      onImageSelect(null);
    }
  };

  return (
    <Stack>
      <FileInput
        label="Upload Image"
        placeholder="Click to upload or drag image here"
        icon={<IconUpload size={16} />}
        accept="image/*"
        value={file}
        onChange={handleFileChange}
        clearable
        rightSection={
          file && (
            <ActionIcon onClick={() => handleFileChange(null)} variant="subtle" color="red">
              <IconX size={16} />
            </ActionIcon>
          )
        }
      />

      {localPreviewUrl && (
        <Group position="center">
          <MantineImage
            src={localPreviewUrl}
            alt="Image preview"
            maw={240}
            mx="auto"
            radius="md"
          />
        </Group>
      )}
    </Stack>
  );
}